import 'bootstrap/dist/css/bootstrap.css';

function NavButtons (props) {
    return (
                    <button className={`btn btn-${props.color}`}>
                        {props.name}
                    </button>
    );
}

export default NavButtons;