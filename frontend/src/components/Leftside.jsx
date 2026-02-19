import '../sass/Leftbar.scss';
import logo from '../assets/images/logo.svg';

function LeftSide() {
  return (
    <div className="leftside">
      <img src={logo} alt="TaxPal Logo" className="logo" />

      <h2>Welcome to TaxPal....</h2>

      <p className="description">
        To stay connected with us please login with your personal email
        address and password.
      </p>
      <p className="copyright">
        ©2025 TaxPal. All rights reserved.
      </p>
    </div>
  );
}

export default LeftSide;
