import React, { useState } from "react";
import bg from "../../Assets/loginBG.JPG";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { login } from '../../Components/Redux/Auth/AuthSlice';
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

    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const passvalid = /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9-]{7,}$/;

    const [data, setData] = useState({
      username: "",
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




    const submit = () =>{
        if (data.username==='' && data.password===''){
            setErrormsg('Please fill out all fields');
            document.querySelector('input[name="username"]').classList.add('error');
            document.querySelector('input[name="password"]').classList.add('error');

        }else if (data.username === ''){
          document.querySelector('input[name="username"]').classList.add('error');
          setErrormsg("Enter your Email")

        }else if (regex.test(data.username) === false){
          document.querySelector('input[name="username"]').classList.add('error');
          setErrormsg("Enter a valid Email")

        }else if (data.password === ''){
          document.querySelector('input[name="password"]').classList.add('error');
          setErrormsg("Enter your Password")

        }else if (passvalid.test(data.password) === false){
          document.querySelector('input[name="password"]').classList.add('error');
          setErrormsg("Enter a valid Password")

        }else{
            UserLogin(data, {
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then((response) => {
                navigate('/');
                dispatch(login(data.username));
                alert("Account Logged in")
              })
              .catch((error) => {
                alert(
                  "Invalid Credentials!\nor your account may not activated\nPlease check your email for activation"
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
            <h1 style={{color: 'white', fontSize: '25px', marginTop: '-300px', fontWeight: 'normal', marginLeft: '-50px'}}>Login to your account</h1>
           
            <input 
            className="email"
            //placeholder="Email"
            type="type"
            name="username"
            value={data.username}
            onChange={handleInputChange}
            required = 'required'/>
            <span className="em">Email</span>
            <img src={USER} alt='user' style={{position:'absolute', marginTop:'-185px', marginLeft: '-255px', height:'25px', width: '25px'}}/>

            

            <input 
            className="pass"
            //placeholder="pass"
            type="password"
            name="password"
            value={data.password}
            onChange={handleInputChange}
            required = 'required'/>
            <span className="password">Password</span>
            <img src={LOCK} alt='lock'style={{position:'absolute', marginTop:'-37px', marginLeft: '-260px',height: '20px', width: '20px'}}/>
            
                <h4 style={{position:'absolute', marginTop: '260px',marginLeft: '-235px', color: 'white',fontWeight: 'normal',fontSize:'14px'}}>No worries,</h4>
            <a href style= {{position:'absolute', cursor: 'pointer', width: '200px'}}>
                <Link to = 'forgotpass' style={{color: '#4B8DF8', fontWeight: 'normal', fontSize:'14px',position:'absolute', marginTop: '110px',marginLeft: '18px'}}>pleace click here </Link>
            </a>
                <h4 style={{position:'absolute', marginTop: '260px',marginLeft: '180px', color: 'white',fontWeight: 'normal',fontSize:'14px'}}>to reset your password</h4>

            <div style={{display: 'flex', flexDirection: 'row', backgroundColor: '#4B8DF8' , height: '40px', width: '100px', justifyContent: 'space-evenly', marginTop: '100px', position: "absolute", marginLeft: '210px', cursor: "pointer"}} onClick={submit}>
                <h4 style={{marginTop: '8px', color: 'white'}}>Login</h4>
              <img src={USTP2} alt="USTP logo" style={{ width: '25px', height: '25px', marginTop: '7px', marginLeft: '10px', }}/>
            </div>
            <p className="signuperror">{errormsg}</p>
            <h4 style={{position:'absolute', marginTop: '200px',marginLeft: '-125px', color: 'white',fontWeight: 'normal',fontSize:'17px'}}>Forgot your password?</h4>
            <h4 style={{position:'absolute', marginTop: '310px',marginLeft: '0px', color: 'white',fontWeight: 'normal',fontSize:'19px',letterSpacing: '1px'}}>...............................................................</h4>
            <a href style= {{position:'absolute', textDecorationLine: 'underline', cursor: 'pointer', top: '360px',left: '30px',textDecorationColor: 'white'}}>
                <Link to = 'registration' style={{color: 'white', fontWeight: 'normal'}}>Doesn’t have an account? Sign Up Here.</Link>
            </a>
          </div>
        </div>
        
      </div>
    )
}

export default Login