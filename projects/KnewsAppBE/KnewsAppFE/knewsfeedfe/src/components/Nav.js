import 'bootstrap/dist/css/bootstrap.css';
import NavButtons from './NavButtons';

function Nav() {

    const navButtonStyle = {
        listStyle: 'none'
    };

    const navStyle = {
        background: '#FFFDD0'
    }
    return (
        <div className="nav-container border border-black p-1 m-0 sticky-top" style={navStyle}> 
            <nav className="navbar">

            <h1 className='m-1 p-2'>KnewsFeed.</h1>

            <ul style={navButtonStyle} className="btn-group m-2">
                <li className='m-1'> 
                   <NavButtons name='Tech' color='primary'/>
                </li>

                <li className='m-1'> 
                    <NavButtons name='Sports' color='success'/>
                </li>

                <li className='m-1'> 
                    <NavButtons name='Health' color='danger'/>
                </li>

                <li className='m-1'> 
                    <NavButtons name='Entertainment' color='warning'/>
                </li>

                <li className='m-1' > 
                    <NavButtons name='Science' color='info'/>
                </li>

            </ul>
            </nav>
        </div>
    );

}

export default Nav
