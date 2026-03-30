from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_ollama.llms import OllamaLLM
from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from contextlib import asynccontextmanager
import os
import json
import uvicorn

# ===== Global vars =====
model = None
retriever = None
chain = None


# ===== Pydantic models =====
class ChatRequest(BaseModel):
    question: str


class ChatResponse(BaseModel):
    answer: str
    retrieved_docs: list
    status: str


# ===== Knowledge base builder =====
def build_documents():
    docs = []
    base = os.path.join(os.path.dirname(__file__), "..", "..", "..", "src", "data")

    # 1. Profile text
    profile_txt = os.path.join(os.path.dirname(__file__), "data", "professional_profile.txt")
    if os.path.exists(profile_txt):
        with open(profile_txt, "r", encoding="utf-8") as f:
            content = f.read()
        for section in content.split("---"):
            section = section.strip()
            if section:
                lines = section.split("\n", 1)
                title = lines[0].strip().rstrip(":")
                body = lines[1].strip() if len(lines) > 1 else section
                docs.append(Document(page_content=body, metadata={"title": title, "source": "profile_text"}))

    # 2. profile.json — bio, roles, contact
    path = os.path.join(base, "profile.json")
    if os.path.exists(path):
        with open(path) as f:
            p = json.load(f)
        bio_text = (
            f"Name: {p.get('name')}\n"
            f"Location: {p.get('location')}\n"
            f"Email: {p.get('email')}\n"
            f"GitHub: {p.get('github')}\n"
            f"LinkedIn: {p.get('linkedin')}\n"
            f"Bio: {p.get('bio_long')}\n"
            f"Tagline: {p.get('tagline')}"
        )
        docs.append(Document(page_content=bio_text, metadata={"title": "About Quest Parker", "source": "profile.json"}))
        for role in p.get("roles", []):
            docs.append(Document(
                page_content=f"Role: {role['label']}\n{role['description']}",
                metadata={"title": f"Role: {role['label']}", "source": "profile.json"}
            ))

    # 3. experience.json — each position
    path = os.path.join(base, "experience.json")
    if os.path.exists(path):
        with open(path) as f:
            exp = json.load(f)
        for pos in exp.get("positions", []):
            bullets = "\n".join([f"- {b['text']} ({b.get('impact', '')})" for b in pos.get("bullets", [])])
            text = (
                f"Company: {pos['company']}\n"
                f"Title: {pos['title']}\n"
                f"Location: {pos['location']}\n"
                f"Period: {pos['start']} to {'Present' if pos.get('current') else pos.get('end', '')}\n"
                f"Highlights:\n{bullets}\n"
                f"Tags: {', '.join(pos.get('tags', []))}"
            )
            docs.append(Document(
                page_content=text,
                metadata={"title": f"Experience: {pos['title']} at {pos['company']}", "source": "experience.json"}
            ))

    # 4. projects.json — each project
    path = os.path.join(base, "projects.json")
    if os.path.exists(path):
        with open(path) as f:
            proj = json.load(f)
        for p in proj.get("projects", []):
            text = (
                f"Project: {p['title']}\n"
                f"Company/Context: {p['company']}\n"
                f"Year: {p['year']}\n"
                f"Status: {p['status']}\n"
                f"Description: {p['long_description']}\n"
                f"Tech Stack: {', '.join(p.get('tech_stack', []))}\n"
                f"Impact: {p.get('impact', '')}"
            )
            if p.get('impact_quantified'):
                text += f"\nQuantified Impact: {p['impact_quantified']}"
            docs.append(Document(
                page_content=text,
                metadata={"title": f"Project: {p['title']}", "source": "projects.json"}
            ))

    # 5. skills.json — each category
    path = os.path.join(base, "skills.json")
    if os.path.exists(path):
        with open(path) as f:
            skills = json.load(f)
        all_skills = []
        for cat in skills.get("categories", []):
            skill_list = ", ".join(cat["skills"])
            text = f"{cat['label']} skills: {skill_list}"
            docs.append(Document(
                page_content=text,
                metadata={"title": f"Skills: {cat['label']}", "source": "skills.json"}
            ))
            all_skills.extend(cat["skills"])
        docs.append(Document(
            page_content=f"Complete skill set: {', '.join(all_skills)}",
            metadata={"title": "All Skills", "source": "skills.json"}
        ))

    # 6. education.json
    path = os.path.join(base, "education.json")
    if os.path.exists(path):
        with open(path) as f:
            edu = json.load(f)
        for deg in edu.get("degrees", []):
            status = "In progress" if deg.get("status") == "in-progress" else "Completed"
            date = deg.get("expected") or deg.get("graduated", "")
            text = (
                f"Degree: {deg['degree']} in {deg['field']}\n"
                f"Institution: {deg['institution']}\n"
                f"Focus: {deg.get('focus', '')}\n"
                f"Location: {deg['location']}\n"
                f"Status: {status} ({date})"
            )
            docs.append(Document(
                page_content=text,
                metadata={"title": f"Education: {deg['institution']}", "source": "education.json"}
            ))

    # 7. personal.json — origin story, interests, background
    path = os.path.join(base, "personal.json")
    if os.path.exists(path):
        with open(path) as f:
            personal = json.load(f)
        origin = personal.get("origin", {})
        origin_text = (
            f"Hometown: {origin.get('hometown')}\n"
            f"Current City: {origin.get('current_city')}\n"
            f"Family: {origin.get('family')}\n"
            f"Pets: {origin.get('pets')}\n"
            f"Cat name: {origin.get('cat')}\n"
            f"Started coding: {origin.get('coding_since')}\n"
            f"High School: {origin.get('high_school')}\n"
            f"Origin Story: {origin.get('story')}"
        )
        docs.append(Document(
            page_content=origin_text,
            metadata={"title": "Quest Parker — Personal Background & Origin Story", "source": "personal.json"}
        ))

        # Dedicated pet document so pet-related queries always retrieve it
        pet_text = (
            f"Does Quest have pets? Yes. Quest Parker has a cat named Cell. "
            f"Cell is his pet cat who lives with him in Raleigh, NC. "
            f"Quest often jokes that Cell supervises his studying."
        )
        docs.append(Document(
            page_content=pet_text,
            metadata={"title": "Quest Parker — Pet (Cat named Cell)", "source": "personal.json"}
        ))

        interests = personal.get("interests", [])
        if interests:
            docs.append(Document(
                page_content=f"Quest Parker's interests and hobbies: {', '.join(interests)}",
                metadata={"title": "Quest Parker — Interests & Hobbies", "source": "personal.json"}
            ))
        current_status = personal.get("current_status", "")
        if current_status:
            docs.append(Document(
                page_content=f"Current status: {current_status}",
                metadata={"title": "Quest Parker — Current Status", "source": "personal.json"}
            ))

    # 8. career_highlights.json — notable wins and impact stories
    path = os.path.join(base, "career_highlights.json")
    if os.path.exists(path):
        with open(path) as f:
            ch = json.load(f)
        for hl in ch.get("highlights", []):
            text = (
                f"Career Highlight: {hl['label']}\n"
                f"Impact: {hl['impact']}\n"
                f"Description: {hl['description']}\n"
                f"Tags: {', '.join(hl.get('tags', []))}"
            )
            docs.append(Document(
                page_content=text,
                metadata={"title": f"Career Highlight: {hl['label']}", "source": "career_highlights.json"}
            ))

    print(f"📚 Built {len(docs)} documents for knowledge base")
    return docs


# ===== Lifespan =====
@asynccontextmanager
async def lifespan(app: FastAPI):
    global model, retriever, chain
    print("🚀 Starting RAG API server...")

    model = OllamaLLM(model="llama3.2:3b")
    embeddings = OllamaEmbeddings(model="nomic-embed-text")

    db_loc = os.path.join(os.path.dirname(__file__), "vector_db")
    add_documents = not os.path.exists(db_loc)

    if add_documents:
        print("🔨 Building vector store from full portfolio data...")
        documents = build_documents()
        vectorstore = Chroma.from_documents(
            documents=documents,
            embedding=embeddings,
            persist_directory=db_loc,
        )
    else:
        print("♻️  Loading existing vector store...")
        vectorstore = Chroma(persist_directory=db_loc, embedding_function=embeddings)

    retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 4})

    template = """You are an AI assistant embedded in Quest Parker's personal portfolio website.
Your job is to answer questions about Quest Parker accurately and professionally.

Quest Parker is a Value Engineer and Applied AI Champion at Celonis, based in Raleigh, NC.
He builds data-driven solutions across data science, machine learning, and AI that deliver
measurable business impact. He has a BA in Computer Science from UNC Chapel Hill and is
pursuing an MS in Computer Science (AI focus) at CU Boulder.

Use the context below to answer questions. Be concise, accurate, and conversational.
If the context doesn't contain enough information to answer confidently, say so honestly.
Do not make up facts about Quest.

Context:
{context}

Question: {question}

Answer:"""

    prompt = ChatPromptTemplate.from_template(template)
    chain = prompt | model

    print("✅ Chat agent ready")
    yield
    print("🛑 Shutting down...")


# ===== App =====
app = FastAPI(title="Quest Parker Chat Agent", version="2.0.0", lifespan=lifespan)

CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "").split(",")
CORS_ORIGINS = [o.strip() for o in CORS_ORIGINS if o.strip()]
CORS_ORIGINS += [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Quest Parker Chat Agent", "status": "running"}


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        relevant_docs = retriever.invoke(request.question)

        if not relevant_docs:
            return ChatResponse(
                answer="I don't have specific information about that. Feel free to reach out to Quest directly at questonp123@gmail.com.",
                retrieved_docs=[],
                status="no_results",
            )

        context = "\n\n".join([
            f"[{doc.metadata.get('title')}]\n{doc.page_content}"
            for doc in relevant_docs
        ])

        result = chain.invoke({"context": context, "question": request.question})

        doc_info = [
            {"title": doc.metadata.get("title", ""), "content_preview": doc.page_content[:100] + "..."}
            for doc in relevant_docs
        ]

        return ChatResponse(answer=str(result).strip(), retrieved_docs=doc_info, status="success")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
