import React, { useState } from "react";
import bg from "../../Assets/loginBG.JPG";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux'; 
import { setAdmin, setCollege } from '../../Components/Redux/Auth/AuthSlice';
import { UserRegistration } from "../../api";
import USTP from '../..//Assets/logo3.png';
import USTP2 from '../..//Assets/arrow.png';
import USER from '../..//Assets/user.png';
import LOCK from '../..//Assets/lock.png';
import styles from '../../Components/Styles/styles.css'

const Registration = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [errormsg, setErrormsg] = useState("");

    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const passvalid = /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9-]{7,}$/;

    const [data, setData] = useState({
      department: "",
      role: "Student", 
      email: "",
      password: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData((prevState) => ({ ...prevState, [name]: value }));
        const inputElement = document.querySelector(`input[name="${name}"]`);
        if (inputElement) {
          inputElement.classList.remove('error');
          setErrormsg(' ');
        }
    };

    const handleRoleChange = (e) => {
        setData({ ...data, role: e.target.value });
    };

    const submit = () => {
        if (data.department === "" || data.email === "" || data.password === "") {
            setErrormsg("Please fill out all fields");
            return;
        }
    
        if (!regex.test(data.email)) {
            setErrormsg("Enter a valid Email");
            return;
        }
    
        if (!passvalid.test(data.password)) {
            setErrormsg("Enter a valid Password");
            return;
        }
    
        UserRegistration(data)
            .then((response) => {
                console.log("Registration successful:", response);
                navigate('/'); 
            })
            .catch((error) => {
                console.error("Registration error:", error);
                setErrormsg("Registration failed. Please try again.");
            });
    };

    return (
        <div style={{ backgroundColor: "lightgray", height:'100%'}}>
            <div className='conLogin'>
                <img src={bg} className='bghehe' alt='logo'/>
                <div className='secondLogin'>
                    <img src={USTP} alt="USTP logo" style={{ width: '150px', height: '150px', marginTop: '-600px', position: 'absolute' }}/>
                    <h1 style={{color: 'white', fontSize: '25px', marginTop: '-270px', fontWeight: 'normal', marginLeft: '-20rem'}}>Register an account</h1>
                    <input 
                        className="dept"
                        type="text"
                        name="department"
                        value={data.department}
                        onChange={handleInputChange}
                        required/>
                        <span className="department">Department</span>

                    <input 
                        className="emailLog"
                        type="text"
                        name="email"
                        value={data.email}
                        onChange={handleInputChange}
                        required/>
                        <span className="emLog">Email</span>

                    <select
                        className="role"
                        name="role"f
                        value={data.role}
                        onChange={handleRoleChange}>
                        <option value="Admin">Admin</option>
                        <option value="Scheduler">Scheduler</option>
                    </select>

                    <input 
                        className="passLog"
                        type="password"
                        name="password"
                        value={data.password}
                        onChange={handleInputChange}
                        required/>
                        <span className="passwordLog">Password</span>
                                    
                    <div style={{display: 'flex', flexDirection: 'row', backgroundColor: '#4B8DF8' , height: '40px', width: '135px', justifyContent: 'space-evenly', marginTop: '100px', position: "absolute", marginLeft: '25.5rem', cursor: "pointer"}} onClick={submit}>
                        <h4 style={{marginTop: '8px', color: 'white'}}>Register</h4>
                        <img src={USTP2} alt="USTP logo" style={{ width: '25px', height: '25px', marginTop: '7px', marginLeft: '10px', }}/>
                    </div>
                    <p className="signuperror">{errormsg}</p>
                    <h4 style={{position:'absolute', marginTop: '300px',marginLeft: '-22rem', color: 'white',fontWeight: 'normal',fontSize:'17px'}}>Already have an account?</h4>
                    <h4 style={{position:'absolute', marginTop: '230px',marginLeft: '0px', color: 'white',fontWeight: 'normal',fontSize:'19px',letterSpacing: '1px'}}>............................................................................................................</h4>
                    <a href style= {{position:'absolute', textDecorationLine: 'underline', cursor: 'pointer', top: '303px',left: '230px',textDecorationColor: 'white'}}>
                        <Link to = '/' style={{color: 'white', fontWeight: 'normal'}}>Log in here.</Link>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Registration;
