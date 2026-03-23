import Sidebar from './Sidebar';
import '../sass/TaxEstimatorLayout.scss';

const TaxEstimatorLayout = ({ children }) => {
    return (
        <div className="taxestimator-layout">
            <Sidebar />
            <main className="main-content">
                <header className="top-header">
                    <h2>Tax Estimator</h2>
                    <button className="btn-blue" onClick={() => setActiveModal('expense')}>+ View Tax Calender</button>
                </header>
                <div className="page-content">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default TaxEstimatorLayout;