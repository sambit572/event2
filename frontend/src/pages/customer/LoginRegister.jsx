// import React, {useState} from 'react'
// import './LoginRegister.css';
// import { MdDriveFileRenameOutline, MdEmail } from "react-icons/md";
// import { FaLock } from "react-icons/fa";


// const LoginRegister = () => {

//     const [action, setAction] = useState('');

//     const registerLink = () => {
//         setAction(' active');
//     }
//     const loginLink = () => {
//         setAction('');
//     }

//     return (
//         <div className={`wrapper${action}`}>
//             <div className='form-box login'>
//                 <form>
//                     <h1>Login</h1>
//                     <div className='input-box'>
//                         <input type="email" placeholder='Email' required /><MdEmail className='icon' />
//                     </div>
//                     <div className='input-box'>
//                         <input type="password" placeholder='Password' required /><FaLock className='icon'/>
//                     </div>
//                     <div className="remember-forgot">
//                         <label><input type="checkbox"
//                         /> Remember Me 
//                         </label>
//                         <a href="#">Forgot Password?</a>
//                     </div>
//                     <button type="submit">Login</button>
//                     <div className="register-link">
//                         <p>Don't have an account?<a href="#" onClick={registerLink}> Register</a></p>
//                     </div>
//                 </form>
//             </div>

//             <div className='form-box register'>
//                 <form>
//                     <h1>Registration</h1>
//                     <div className='input-box'>
//                         <input type="text" placeholder='First Name' required /><MdDriveFileRenameOutline className='icon' />
//                     </div>
//                     <div className='input-box'>
//                         <input type="text" placeholder='Last Name' required /><MdDriveFileRenameOutline className='icon' />
//                     </div>
//                     <div className='input-box'>
//                         <input type="email" placeholder='Email' required /><MdEmail className='icon' />
//                     </div>
                    {/* <div className='input-box'>
                        <input type="number" placeholder='Phone Number' required /><MdEmail className='icon' />
                    </div>
                    <div className='input-box'>
                        <input type="text" placeholder='Street Address' required /><MdEmail className='icon' />
                    </div>
                    <div className='input-box'>
                        <input type="text" placeholder='City' required /><MdEmail className='icon' />
                    </div>
                    <div className='input-box'>
                        <input type="number" placeholder='Pin Code' required /><MdEmail className='icon' />
                    </div>
                    <div className='input-box'>
                        <input type="password" placeholder='Password' required /><FaLock className='icon'/>
                    </div>
                    <div className='input-box'>
                        <input type="password" placeholder=' Confirm Password' required /><FaLock className='icon'/>
                    </div> */}
//                     <div className="remember-forgot">
//                         <label><input type="checkbox"
//                         /> I agree to the terms & conditions 
//                         </label>
//                     </div>
//                     <button type="submit">Register</button>
//                     <div className="register-link">
//                         <p>Already have an account?<a href="#" onClick={loginLink}> Login</a></p>
//                     </div>
//                 </form>
//             </div>
//         </div> 

//     );
// };

// export default LoginRegister;