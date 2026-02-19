// import '..sass/AuthLayout.scss';
// import LeftSide from '../components/LeftSide';

import '../sass/AuthLayout.scss'
import LeftSide from '../components/Leftside';
function AuthLayout({ children }) {
    return (
        <div className="auth-layout">

                <div className="auth-left">
                    <LeftSide />
                </div>
                <div className="auth-right">
                    {children}
                </div>
            </div>

    );
}

export default AuthLayout;
