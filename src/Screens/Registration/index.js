import React, { useState, useEffect } from "react";
import bg from "../../Assets/loginBG.JPG";
import { Link, useNavigate } from "react-router-dom";
import { createUserProfile } from "../../api";
import USTP from '../..//Assets/logo3.png';
import USTP2 from '../..//Assets/arrow.png';
import axios from "axios";
import { useSelector } from "react-redux";

const Registration = () => {
    const navigate = useNavigate();
    const [errormsg, setErrormsg] = useState("");
    const [msg, setMsg] = useState("");
    const [userlist, setUserlist] = useState([]);
    // eslint-disable-next-line
    const [emailExists, setEmailExists] = useState(false);
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

    useEffect(() => {
      // Check if the user is logged in and navigate accordingly
      if (isLoggedIn) {
        navigate('/'); // Redirect to the '/' route
      }
    }, [isLoggedIn, navigate]);

    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const passvalid = /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9-]{7,}$/;

    const [data, setData] = useState({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        isAdmin: false,
        college: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData((prevState) => ({ ...prevState, [name]: value }));
        const inputElement = document.querySelector(`input[name="${name}"]`);
        if (inputElement) {
            inputElement.classList.remove('error');
            setErrormsg(' ');
            setMsg(' ');
        }
    };

    const handleRoleChange = (e) => {
        const value = e.target.value;
        const isAdmin = value === 'Admin';
        setData((prevState) => ({ ...prevState, isAdmin, last_name: value }));
        setErrormsg(' ');
        setMsg(' ');
    };

    useEffect(() => {
      // Fetch user data from the server when the component mounts
      axios.get('http://localhost:8000/users/')
          .then(response => {
          console.log(response.data)
          const fetchedUserlist = response.data; // Assuming the response contains user data
          setUserlist(fetchedUserlist);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          // setErrormsg('Error fetching user data ha. Please try again.');
        });
    }, []); // Empty dependency array ensures this effect runs only once on component mount

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        submit();
      }
    };
    
      const submit = () => {
        if (data.college === '' || data.email === '' || data.password === '') {
          setErrormsg('Please fill out all fields');
          return;
        } else if (data.email === '') {
          setErrormsg('Enter your Email');
          return;
        } else if (regex.test(data.email) === false) {
          setErrormsg('Enter a valid Email');
          return;
        } else if (data.password === '') {
          setErrormsg('Enter your Password');
          return;
        } else if (passvalid.test(data.password) === false) {
          setErrormsg('Enter a valid Password');
          return;
        }
    
        // Check if the email already exists in the fetched user data
        const emailExists = userlist.some((user) => user.email === data.email);
    
        if (emailExists) {
          setErrormsg('Email address already exists');
        } else { 
        setMsg('Account Registering, please wait!');
        setErrormsg('');
          createUserProfile(data)
            .then((response) => {
              console.log('Registration successful:', response);
              navigate('/');
            })
            .catch((error) => {
              console.error('Registration error:', error);
              navigate('/');
            });
        }
      };



    return (
        <div style={{ backgroundColor: "lightgray",
                height:'100%'}}>

            <div className='conLogin'>
                <img src={bg} className='bghehe' alt='logo'/>

                <div className='secondLogin'>

                    <img src={USTP} alt="USTP logo" 
                        style={{ width: '150px', 
                            height: '150px', 
                            marginTop: '-600px', 
                            position: 'absolute' }}/>

                    <h1 style={{position: 'absolute',
                            color: 'white',
                            fontSize: '25px', 
                            fontWeight: 'normal',
                            top:'0px'
                            }}>Register an account </h1>

                    <input 
                        className="dept"
                        type="text"
                        name="college"
                        value={data.college}
                        onChange={(e) => {
                            const newValue = e.target.value;
                            setData(prevState => ({
                                ...prevState,
                                college: newValue,
                                first_name: newValue, // Update first_name along with college
                            }));
                            setErrormsg(' ');
                            setMsg(' ');
                        }}
                        onKeyDown={handleKeyPress}
                        required/>
                        <span className="department">College</span>

                    <input 
                        className="emailLog"
                        type="text"
                        name="email"
                        value={data.email}
                        onChange={(e) => {
                            const newValue = e.target.value;
                            setData(prevState => ({
                                ...prevState,
                                email: newValue,
                                username: newValue, // Update first_name along with college
                            }));
                            setErrormsg(' ');
                            setMsg(' ');
                        }}
                        onKeyDown={handleKeyPress}
                        required/>
                        <span className="emLog">Email</span>

                    <select
                        className="role"
                        name="role"
                        value={data.role}
                        onKeyDown={handleKeyPress}
                        onChange={handleRoleChange}>

                        <option value=" " disabled selected
                                 style={{fontSize:'20px',
                                    color:'white' }}
                        >Select</option>

                        <option value="Admin"
                                 style={{fontSize:'20px',
                                    color:'black' }}
                        >Admin</option>

                        <option value="Scheduler"
                                 style={{fontSize:'20px',
                                    color:'black' }}
                        >Scheduler</option>
                    </select>

                    <input 
                        className="passLog"
                        type="password"
                        name="password"
                        value={data.password}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                        required/>
                        <span className="passwordLog">Password</span>
                                    
                    <button style={{display: 'flex', 
                            flexDirection: 'row', 
                            backgroundColor: '#4B8DF8' , 
                            height: '50px', 
                            width: '155px', 
                            justifyContent: 'space-evenly', 
                            top: '63%', 
                            left: '600px', 
                            position: "absolute", 
                            cursor: "pointer"}} 
                        onClick={submit}>

                        <text style={{position:'absolute', top:'10px', left:'20px', color: 'white', fontSize:'20px'}}>Register</text>

                        <img src={USTP2} alt="USTP logo" 
                            style={{ position:'absolute', width: '35px', height: '35px', top: '7px', left:'75%', }}/>
                    </button>

                    <p className="signuperror">{errormsg}</p>
                    <p className="message">{msg}</p>

                    <h4 style={{position:'absolute', 
                            // textAlign:'center',
                            top: '290px',
                            left: '260px', 
                            color: 'white',
                            fontWeight: 'normal',
                            fontSize:'20px'}}>Already have an account?</h4>
                    
                    <h4 style={{position:'absolute', 
                            top: '260px',
                            left: '20px', 
                            color: 'white',
                            fontWeight: 'normal',
                            fontSize:'19px',
                            letterSpacing: '1px'}}>.....................................................................................................................................................</h4>
                    
                    <a href style= {{position:'absolute', 
                                textDecorationLine: 'underline', 
                                cursor: 'pointer', 
                                top: '315px',
                                left: '490px',
                                textDecorationColor: 'white'}}>
                        <Link to = '/' style={{fontSize:'20px' ,color: '#4B8DF8', fontWeight: 'normal'}}>Log in here.</Link>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Registration;
