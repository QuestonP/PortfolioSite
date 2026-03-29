

function navbar(){
    return (
        <div>
            <header>
                <navbar>
                    <div className="navbar-container">
                        <div className="category-btn-container">
                        <ul class="btn-group position-absolute ">
            
                            <li>
                                <label for="pageName" class="btn btn-outline-secondary btn-sm btn-group-item text-black border-0 fs-italic fs-bold py-4">Home</label></li>
  
                            <li>
                                <label for="tech-radio" class="btn btn-outline-success btn-sm btn-group-item text-black fs-italic fs-bold py-5 border-0">Tech</label></li>
  
                            <li>
                                <label for="sports-radio" class="btn btn-outline-primary btn-sm btn-group-item text-black fs-italic py-5 border-0">Sports</label></li>
  
                            <li>
                            <label for="economy-radio" class="btn btn-outline-danger btn-sm btn-group-item text-black fs-italic py-5 border-0">Business</label></li>
                
                            <li>
                                <label for="health-radio" class="btn btn-outline-dark btn-sm btn-group-item text-black fs-italic py-5 border-0">Health</label></li>
            
                                <li>
                                <label for="culture-radio" class="btn btn-outline-warning btn-group-item btn-sm text-black fs-italic py-5 border-0">Culture</label></li>
  
                        </ul>
                        </div>
                    </div>
                </navbar>
            </header>
        </div>);
}
export default navbar
