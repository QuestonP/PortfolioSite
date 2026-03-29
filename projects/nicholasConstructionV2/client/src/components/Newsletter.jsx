import React, { useState } from 'react';

function Newsletter() {
  const SubscribeForm = () => {
    const [status, setStatus] = useState(null);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");

    const FORM_URL = `the URL you created in the previous section`;

    const handleSubmit = async (event) => {
      event.preventDefault();

      const data = new FormData(event.target);

      try {
        const response = await fetch(FORM_URL, {
          method: "post",
          body: data,
          headers: {
            accept: "application/json",
          },
        });

        setEmail("");
        const json = await response.json();

        if (json.status === "success") {
          setStatus("SUCCESS");
          return;
        }
      } catch (err) {
        setStatus("ERROR");
        console.log(err);
      }
    };

    const handleEmailChange = (event) => {
      const { value } = event.target;
      setEmail(value);
    };

    const handleNameChange = (event) => {
      const { value } = event.target;
      setName(value);
    };

    return (
      <div className='w-full'>
        {status === "SUCCESS" && (
          <>
            <p>
              Welcome aboard{name ? `, ${name}` : ""}{" "}
            </p>
            <p>Please check your inbox to confirm the subscription!</p>
          </>
        )}
        {status === "ERROR" && (
          <>
            <p>Oops, something went wrong...</p>
            <p>
              Please,{" "}
              <button onClick={() => setStatus(null)}>try again.</button>
            </p>
          </>
        )}
        {status === null && (
          <form className='flex flex-col border border-black rounded p-3 bg-blue-300' onSubmit={handleSubmit}>
            <h1 className='text-xl my-2 font-bold bg-blue-300'>Sign Up For Our Newsletter</h1>
            <input
              aria-label="Your first name"
              name="fields[first_name]"
              placeholder="Your first name"
              type="text"
              onChange={handleNameChange}
              value={name}
              className='my-2 p-3 rounded'
            />
            <input
              aria-label="Your email address"
              name="email_address"
              placeholder="Your email address"
              required
              type="email"
              onChange={handleEmailChange}
              value={email}
              className='my-2 p-3 rounded'
            />
            <button type="submit" className='mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>SUBSCRIBE</button>
          </form>
        )}
      </div>
    );
  };

  return <SubscribeForm />;
}

export default Newsletter;
