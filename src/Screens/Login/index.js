import React, { useState } from "react";
import bg from "../../Assets/loginBG.JPG";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { login, setAdmin, setCollege } from '../../Components/Redux/Auth/AuthSlice';
import { UserLogin } from "../../api";
import USTP from '../..//Assets/logo3.png';
import USTP2 from '../..//Assets/arrow.png';
import USER from '../..//Assets/user.png';
import LOCK from '../..//Assets/lock.png';
// eslint-disable-next-line
import styles from '../../Components/Styles/styles.css'

const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [errormsg, setErrormsg] = useState("")
    const storedUsername = useSelector(state => state.auth.username);

    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const passvalid = /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9-]{7,}$/;

    const [data, setData] = useState({
      username: "",
      password: "",
    });

    if (storedUsername === '') {
      dispatch(setAdmin(false));
      dispatch(setCollege(''));
    }
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData((prevState) => ({ ...prevState, [name]: value }));
        const inputElement = document.querySelector(`input[name="${name}"]`);
        if (inputElement) {
          inputElement.classList.remove('error');
          setErrormsg(' ');
        }
      };

      const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
          submit();
        }
      };


    const submit = () =>{
        if (data.username==='' && data.password===''){
            setErrormsg('Please fill out all fields');
            
        }else if (data.username === ''){
          
          setErrormsg("Enter your Email")

        }else if (regex.test(data.username) === false){
          
          setErrormsg("Enter a valid Email")

        }else if (data.password === ''){
          
          setErrormsg("Enter your Password")

        }else if (passvalid.test(data.password) === false){
          
          setErrormsg("Enter a valid Password")

        }else{
            setErrormsg("Logging in!")
            UserLogin(data, {
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then((response) => {
                navigate('/');
                dispatch(login(data.username));
                
              })
              .catch((error) => {
                setErrormsg(
                  "Invalid Credentials!"
                );
              }); 
        }
    }
        


    return( 
      <div style={{ backgroundColor: "lightgray", height:'100%'}}>
        <div className='container'>
        <img src={bg} className='bghehe' alt='logo'/>
          <div className='second'>
            <img src={USTP} alt="USTP logo" style={{ width: '150px', height: '150px', marginTop: '-600px', position: 'absolute' }}/>
            <h1 style={{color: 'white', fontSize: '25px', marginTop: '-280px', fontWeight: 'normal', marginLeft: '-50px'}}>Login to your account</h1>
           
            <input 
            className="email"
            //placeholder="Email"
            type="type"
            name="username"
            value={data.username}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            required = 'required'/>
            <span className="em">Email</span>
            <img src={USER} alt='user' style={{position:'absolute', marginTop:'-175px', marginLeft: '-255px', height:'25px', width: '25px'}}/>

            

            <input 
            className="pass"
            //placeholder="pass"
            type="password"
            name="password"
            value={data.password}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            required = 'required'/>
            <span className="password">Password</span>
            <img src={LOCK} alt='lock'style={{position:'absolute', marginTop:'-37px', marginLeft: '-260px',height: '20px', width: '20px'}}/>
      

            <div style={{display: 'flex', flexDirection: 'row', backgroundColor: '#4B8DF8' , height: '40px', width: '100px', justifyContent: 'space-evenly', marginTop: '100px', position: "absolute", marginLeft: '210px', cursor: "pointer"}} onClick={submit}>
                <h4 style={{marginTop: '8px', color: 'white'}}>Login</h4>
              <img src={USTP2} alt="USTP logo" style={{ width: '25px', height: '25px', marginTop: '7px', marginLeft: '10px', }}/>
            </div>
            <p className="loginerror">{errormsg}</p>
            <h4 style={{position:'absolute', marginTop: '220px',marginLeft: '0px', color: 'white',fontWeight: 'normal',fontSize:'19px',letterSpacing: '1px'}}>...............................................................</h4>
            <a href style= {{position:'absolute', textDecorationLine: 'underline', cursor: 'pointer', top: '310px',left: '30px',textDecorationColor: 'white'}}>
                <Link to = 'registration' style={{color: 'white', fontWeight: 'normal'}}>Doesn’t have an account? Sign Up Here.</Link>
            </a>
            
          </div>
        </div>
      </div>
    )
}

export default Login