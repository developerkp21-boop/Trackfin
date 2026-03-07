import { Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    ShieldCheck,
    FileText,
    UserCheck,
    Link as LinkIcon,
    RefreshCw,
    Mail
} from "lucide-react";
import Button from "../../components/Button";
import "./Legal.css";

const Terms = () => {
    const navigate = useNavigate();

    return (
        <div className="legal-page py-4 py-md-5">
            <div className="content-container px-3 px-sm-4">
                <div className="row justify-content-center">
                    <div className="col-12 col-xl-9">

                        <div className="legal-header text-center px-lg-5">
                            <Button
                                variant="ghost"
                                className="p-0 text-app-secondary mb-4 d-inline-flex align-items-center gap-2 hover-text-primary transition-smooth"
                                onClick={() => window.location.href = "/auth/signup"}
                            >
                                <ArrowLeft size={16} />
                                <span className="fw-medium">Back</span>
                            </Button>
                            <h1 className="fw-bold text-app-primary font-display mb-3">Terms and Conditions</h1>
                            <p className="text-app-muted">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>

                        <div className="card glass-card border-app-subtle shadow-sm legal-card p-4 p-md-5 mx-lg-4">
                            <div className="legal-content">

                                <section>
                                    <h4 className="fw-bold font-display">
                                        <ShieldCheck size={20} className="text-success" />
                                        1. Agreement to Terms
                                    </h4>
                                    <p>
                                        By accessing or using the TrackFin platform ("Service"), you agree to be bound by these Terms and Conditions and our Privacy Policy. If you disagree with any part of these terms, you may not access the Service. These Terms apply to all visitors, users, and others who wish to access or use the Service.
                                    </p>
                                </section>

                                <section>
                                    <h4 className="fw-bold font-display">
                                        <UserCheck size={20} className="text-success" />
                                        2. User Accounts & Security
                                    </h4>
                                    <p>
                                        When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
                                    </p>
                                    <ul>
                                        <li>You are responsible for safeguarding the password and credentials used to access the Service.</li>
                                        <li>You agree not to disclose your password to any third party.</li>
                                        <li>You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h4 className="fw-bold font-display">
                                        <FileText size={20} className="text-success" />
                                        3. Intellectual Property
                                    </h4>
                                    <p>
                                        The Service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of TrackFin and its licensors. The Service is protected by copyright, trademark, and other laws of both the domestic and foreign jurisdictions. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of TrackFin.
                                    </p>
                                </section>

                                <section>
                                    <h4 className="fw-bold font-display">
                                        <LinkIcon size={20} className="text-success" />
                                        4. Links To Third-Party Sites
                                    </h4>
                                    <p>
                                        Our Service may contain links to third-party web sites or services that are not owned or controlled by TrackFin.
                                    </p>
                                    <p>
                                        TrackFin has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party web sites or services. We strongly advise you to read the terms and conditions and privacy policies of any third-party web sites or services that you visit.
                                    </p>
                                </section>

                                <section>
                                    <h4 className="fw-bold font-display">
                                        <RefreshCw size={20} className="text-success" />
                                        5. Changes & Modifications
                                    </h4>
                                    <p>
                                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                                    </p>
                                    <p>
                                        By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms.
                                    </p>
                                </section>

                                <section>
                                    <h4 className="fw-bold font-display">
                                        <Mail size={20} className="text-success" />
                                        Contact Us
                                    </h4>
                                    <p className="mb-0">
                                        If you have any questions, concerns, or require further clarification about these Terms, please contact our legal and support team at <a href="mailto:developerkp21@gmail.com" className="text-success text-decoration-none fw-medium">developerkp21@gmail.com</a>.
                                    </p>
                                </section>

                            </div>
                        </div>

                        <div className="text-center mt-5">
                            <Link to="/auth/signup" className="text-decoration-none text-success fw-bold p-3 border border-success rounded-3 d-inline-block transition-smooth bg-white">
                                Return to Sign Up
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Terms;
