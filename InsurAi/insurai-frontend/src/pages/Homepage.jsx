import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Shield, Users, BarChart3, Bot, CheckCircle, Clock, Eye, DollarSign, ArrowRight, Menu, X, Zap, Database, Settings, TrendingUp, Award, Globe, Lock, Smartphone } from 'lucide-react';

const Homepage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate(); // <-- define navigate

  const features = [
    {
      icon: <Shield className="w-20 h-20 text-blue-500" />,
      title: "AI-Powered Fraud Detection",
      description: "Advanced machine learning algorithms detect suspicious claims, duplicate submissions, and unusual patterns to protect your organization from fraudulent activities and save costs."
    },
    {
      icon: <Clock className="w-20 h-20 text-green-500" />,
      title: "Automated Processing",
      description: "Streamline claim approvals, policy renewals, eligibility checks, and reporting with intelligent automation that reduces processing time by up to 70%."
    },
    {
      icon: <Eye className="w-20 h-20 text-purple-500" />,
      title: "Real-time Transparency",
      description: "Employees can track their claims and policies in real-time with complete visibility, automated notifications, and self-service capabilities 24/7."
    },
    {
      icon: <BarChart3 className="w-20 h-20 text-orange-500" />,
      title: "Advanced Analytics",
      description: "Generate comprehensive PDF/Excel reports, visual dashboards with charts and graphs, and predictive insights for better strategic decision making."
    }
  ];

  const benefits = [
    { icon: <CheckCircle className="w-8 h-8 text-green-500" />, text: "Reduce claim processing time by 70%" },
    { icon: <Zap className="w-8 h-8 text-yellow-500" />, text: "Eliminate manual errors in policy management" },
    { icon: <Clock className="w-8 h-8 text-blue-500" />, text: "24/7 employee self-service portal access" },
    { icon: <Shield className="w-8 h-8 text-red-500" />, text: "Advanced AI fraud detection system" },
    { icon: <Database className="w-8 h-8 text-purple-500" />, text: "Automated compliance and reporting" },
    { icon: <Lock className="w-8 h-8 text-indigo-500" />, text: "Secure role-based access control" },
    { icon: <TrendingUp className="w-8 h-8 text-green-600" />, text: "Predictive analytics for HR insights" },
    { icon: <Globe className="w-8 h-8 text-cyan-500" />, text: "Scalable for large organizations" }
  ];

  const roles = [
    {
      icon: <Users className="w-16 h-16 text-blue-500" />,
      title: "Employee Portal",
      description: "Submit claims, upload documents, track status in real-time, view policies and benefits with complete transparency",
      color: "bg-blue-50 border-blue-200"
    },
    {
      icon: <Settings className="w-16 h-16 text-green-500" />,
      title: "Agent Support",
      description: "Manage employee queries, set availability, assist in claim processes, track pending requests efficiently",
      color: "bg-green-50 border-green-200"
    },
    {
      icon: <BarChart3 className="w-16 h-16 text-yellow-500" />,
      title: "HR Dashboard",
      description: "Manage employee data, approve/reject claims, generate comprehensive reports, review fraud alerts",
      color: "bg-yellow-50 border-yellow-200"
    },
    {
      icon: <Bot className="w-16 h-16 text-purple-500" />,
      title: "System Admin",
      description: "Manage all roles, configure tax rules, monitor fraud detection systems, oversee system health",
      color: "bg-purple-50 border-purple-200"
    }
  ];

  const stats = [
    { icon: <Award className="w-12 h-12 text-blue-500" />, number: "70%", label: "Faster Processing" },
    { icon: <Shield className="w-12 h-12 text-green-500" />, number: "99%", label: "Fraud Detection" },
    { icon: <Clock className="w-12 h-12 text-purple-500" />, number: "24/7", label: "Employee Access" },
    { icon: <TrendingUp className="w-12 h-12 text-orange-500" />, number: "100%", label: "Transparency" }
  ];

  return (
    <div className="w-full min-h-screen">
      {/* Custom Styles */}
      <style jsx>{`
        * {
          box-sizing: border-box;
        }
        .gradient-bg {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .card-hover {
          transition: all 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 50px rgba(0,0,0,0.15);
        }
        .hero-animation {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .text-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .pulse-animation {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .section-spacing {
          padding: 120px 0;
        }
        .hero-section {
          min-height: 100vh;
          padding: 140px 0 120px 0;
        }
      `}</style>

      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
        <div className="container-fluid px-5">
          <a className="navbar-brand fw-bold text-gradient d-flex align-items-center" href="#" style={{ fontSize: '28px' }}>
            <Shield className="w-10 h-10 me-3" />
            InsurAI
          </a>
          
          <button 
            className="navbar-toggler border-0 p-3"
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>

          <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item mx-2"><a className="nav-link fw-medium fs-5" href="#features">Features</a></li>
              <li className="nav-item mx-2"><a className="nav-link fw-medium fs-5" href="#roles">Roles</a></li>
              <li className="nav-item mx-2"><a className="nav-link fw-medium fs-5" href="#benefits">Benefits</a></li>
              <li className="nav-item mx-2"><a className="nav-link fw-medium fs-5" href="#contact">Contact</a></li>
              <li className="nav-item ms-4">
              <button
                  className="btn btn-primary rounded-pill px-5 py-3 fs-6 fw-medium"
                  onClick={() => navigate('/employee/register')} // ✅ absolute path
>
                    Get Started </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="gradient-bg text-white hero-section">
        <div className="container-fluid px-5 h-100">
          <div className="row align-items-center h-100">
            <div className="col-lg-6 text-center text-lg-start pe-lg-5">
              <h1 className="fw-bold mb-5 lh-1" style={{ fontSize: '4.5rem' }}>
                Corporate Insurance Management 
                <span className="text-warning d-block">Revolutionized</span>
              </h1>
              <p className="mb-5" style={{ fontSize: '1.4rem', lineHeight: '1.7' }}>
                InsurAI combines automation, AI intelligence, and transparency to transform how your organization manages employee insurance policies, claims, and benefits with enterprise-grade security.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-4 mb-5 justify-content-center justify-content-lg-start">
                <button className="btn btn-warning btn-lg rounded-pill px-5 py-4 d-flex align-items-center justify-content-center fs-5 fw-medium">
                  Start Free Trial <ArrowRight className="ms-3 w-6 h-6" />
                </button>
                <button className="btn btn-outline-light btn-lg rounded-pill px-5 py-4 fs-5 fw-medium">
                  Watch Demo
                </button>
              </div>
              
              {/* Stats Row */}
              <div className="row text-center mt-5 pt-4">
                {stats.map((stat, index) => (
                  <div key={index} className="col-6 col-lg-3 mb-4">
                    <div className="d-flex flex-column align-items-center">
                      {stat.icon}
                      <h2 className="fw-bold mt-3 mb-2" style={{ fontSize: '3rem' }}>{stat.number}</h2>
                      <span className="text-white-50 fs-5">{stat.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="col-lg-6 text-center mt-5 mt-lg-0 ps-lg-5">
              <div className="hero-animation">
                <div className="bg-white rounded-4 p-5 shadow-lg mx-auto" style={{ maxWidth: '550px' }}>
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <div className="d-flex align-items-center">
                      <div className="bg-success rounded-circle p-3 me-4">
                        <CheckCircle className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-start text-dark">
                        <h5 className="mb-1 fw-bold fs-4">Claims Dashboard</h5>
                        <div className="text-muted fs-6">Real-time Processing</div>
                      </div>
                    </div>
                    <div className="text-success fw-bold fs-5">Live</div>
                  </div>
                  
                  <div className="progress mb-4" style={{ height: '12px' }}>
                    <div className="progress-bar bg-success" style={{ width: '85%' }}></div>
                  </div>
                  
                  <div className="row text-dark g-4">
                    <div className="col-4 text-center">
                      <div className="bg-primary bg-opacity-10 p-4 rounded-3">
                        <h4 className="text-primary mb-1 fw-bold fs-3">1,247</h4>
                        <div className="text-muted fs-6">Claims Processed</div>
                      </div>
                    </div>
                    <div className="col-4 text-center">
                      <div className="bg-success bg-opacity-10 p-4 rounded-3">
                        <h4 className="text-success mb-1 fw-bold fs-3">95%</h4>
                        <div className="text-muted fs-6">Approval Rate</div>
                      </div>
                    </div>
                    <div className="col-4 text-center">
                      <div className="bg-danger bg-opacity-10 p-4 rounded-3">
                        <h4 className="text-danger mb-1 fw-bold fs-3">3</h4>
                        <div className="text-muted fs-6">Fraud Detected</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-spacing bg-light">
        <div className="container-fluid px-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-gradient mb-4" style={{ fontSize: '3.5rem' }}>Powerful Features</h2>
            <p className="text-muted mx-auto" style={{ fontSize: '1.3rem', lineHeight: '1.6', maxWidth: '800px' }}>
              Everything you need to manage corporate insurance efficiently with cutting-edge technology
            </p>
          </div>
          
          <div className="row g-5 justify-content-center">
            {features.map((feature, index) => (
              <div key={index} className="col-lg-6">
                <div className="card h-100 border-0 shadow-sm card-hover">
                  <div className="card-body p-5 text-center">
                    <div className="mb-4">{feature.icon}</div>
                    <h3 className="card-title fw-bold mb-4 fs-2">{feature.title}</h3>
                    <p className="card-text text-muted fs-5 lh-base">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role-based Access Section */}
      <section id="roles" className="section-spacing">
        <div className="container-fluid px-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-gradient mb-4" style={{ fontSize: '3.5rem' }}>Designed for Every Role</h2>
            <p className="text-muted mx-auto" style={{ fontSize: '1.3rem', lineHeight: '1.6', maxWidth: '800px' }}>
              InsurAI provides customized experiences for different user roles within your organization
            </p>
          </div>
          
          <div className="row g-5 justify-content-center">
            {roles.map((role, index) => (
              <div key={index} className="col-lg-6">
                <div className={`card h-100 border-3 card-hover ${role.color}`}>
                  <div className="card-body p-5 text-center">
                    <div className="mb-4">{role.icon}</div>
                    <h3 className="card-title fw-bold mb-4 fs-2">{role.title}</h3>
                    <p className="card-text text-muted fs-5 lh-base">{role.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="section-spacing bg-light">
        <div className="container-fluid px-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-gradient mb-4" style={{ fontSize: '3.5rem' }}>Why Choose InsurAI?</h2>
            <p className="text-muted" style={{ fontSize: '1.3rem' }}>Transform your insurance management with proven benefits</p>
          </div>
          
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="row g-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="col-12">
                    <div className="d-flex align-items-center p-4 bg-white rounded-3 shadow-sm card-hover">
                      {benefit.icon}
                      <span className="ms-4 fs-5 fw-medium">{benefit.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="col-lg-6 mt-5 mt-lg-0 ps-lg-5">
              <div className="text-center">
                <div className="gradient-bg rounded-4 p-5 text-white pulse-animation">
                  <Smartphone className="w-20 h-20 mx-auto mb-4" />
                  <h2 className="fw-bold mb-4 fs-1">Ready to Get Started?</h2>
                  <p className="mb-5 fs-4 lh-base">
                    Join hundreds of companies already using InsurAI to streamline their insurance management processes.
                  </p>
                  <button className="btn btn-warning btn-lg rounded-pill px-5 py-4 fs-5 fw-medium">
                    Request Demo <ArrowRight className="ms-3 w-6 h-6" />
                  </button>
                  <div className="mt-4">
                    <div className="text-white-50 fs-6">No credit card required • Free 30-day trial</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="section-spacing">
        <div className="container-fluid px-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-gradient mb-4" style={{ fontSize: '3.5rem' }}>Built with Modern Technology</h2>
            <p className="text-muted" style={{ fontSize: '1.3rem' }}>Enterprise-grade technology stack for maximum performance and security</p>
          </div>
          
          <div className="row g-5 text-center justify-content-center">
            <div className="col-lg-3 col-md-6">
              <div className="card border-0 shadow-sm card-hover h-100">
                <div className="card-body p-5">
                  <Database className="w-16 h-16 text-primary mb-4" />
                  <h4 className="fw-bold fs-3 mb-3">Java Spring Boot</h4>
                  <p className="text-muted fs-5">Scalable Backend Architecture</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card border-0 shadow-sm card-hover h-100">
                <div className="card-body p-5">
                  <Globe className="w-16 h-16 text-success mb-4" />
                  <h4 className="fw-bold fs-3 mb-3">React.js</h4>
                  <p className="text-muted fs-5">Modern Frontend Framework</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card border-0 shadow-sm card-hover h-100">
                <div className="card-body p-5">
                  <Shield className="w-16 h-16 text-warning mb-4" />
                  <h4 className="fw-bold fs-3 mb-3">JWT Security</h4>
                  <p className="text-muted fs-5">Secure Authentication System</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card border-0 shadow-sm card-hover h-100">
                <div className="card-body p-5">
                  <Bot className="w-16 h-16 text-danger mb-4" />
                  <h4 className="fw-bold fs-3 mb-3">AI/ML Models</h4>
                  <p className="text-muted fs-5">Advanced Fraud Detection</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-bg text-white section-spacing">
        <div className="container-fluid px-5 text-center">
          <h2 className="fw-bold mb-5" style={{ fontSize: '3.5rem' }}>Ready to Transform Your Insurance Management?</h2>
          <p className="mb-5 mx-auto" style={{ fontSize: '1.3rem', lineHeight: '1.6', maxWidth: '800px' }}>
            Join thousands of companies using InsurAI to automate their insurance processes and reduce costs by up to 70%
          </p>
          <div className="d-flex justify-content-center gap-4 flex-wrap">
            <button className="btn btn-warning btn-lg rounded-pill px-5 py-4 d-flex align-items-center fs-5 fw-medium">
              <Zap className="me-3 w-6 h-6" />
              Start Free Trial
            </button>
            <button className="btn btn-outline-light btn-lg rounded-pill px-5 py-4 d-flex align-items-center fs-5 fw-medium">
              <Eye className="me-3 w-6 h-6" />
              Schedule Demo
            </button>
          </div>
          <div className="mt-5">
            <div className="text-white-50 fs-5">Trusted by 500+ companies worldwide • SOC 2 Compliant • 99.9% Uptime</div>
          </div>
        </div>
      </section>

      {/* Footer */}
<footer id="contact" className="bg-light text-dark" style={{ padding: '40px 0' }}>
        <div className="container-fluid px-5">
          <div className="row">
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="d-flex align-items-center mb-3">
                <Shield className="w-8 h-8 me-2" />
                <h3 className="fw-bold mb-0 fs-4">InsurAI</h3>
              </div>
              <p className="text-muted mb-3 fs-6 lh-base">
                Corporate Policy Automation and Intelligence System designed for modern enterprises to streamline insurance management processes with AI-powered efficiency.
              </p>
              <div className="d-flex gap-2">
                <div className="bg-primary bg-opacity-20 p-2 rounded-3">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <div className="bg-success bg-opacity-20 p-2 rounded-3">
                  <Shield className="w-5 h-5 text-success" />
                </div>
                <div className="bg-warning bg-opacity-20 p-2 rounded-3">
                  <Lock className="w-5 h-5 text-warning" />
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-6 mb-4">
              <h4 className="fw-bold mb-3 fs-6">Product</h4>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="#" className="text-muted text-decoration-none fs-6">Features</a></li>
                <li className="mb-2"><a href="#" className="text-muted text-decoration-none fs-6">Pricing</a></li>
                <li className="mb-2"><a href="#" className="text-muted text-decoration-none fs-6">Demo</a></li>
                <li className="mb-2"><a href="#" className="text-muted text-decoration-none fs-6">API</a></li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-6 mb-4">
              <h4 className="fw-bold mb-3 fs-6">Company</h4>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="#" className="text-muted text-decoration-none fs-6">About Us</a></li>
                <li className="mb-2"><a href="#" className="text-muted text-decoration-none fs-6">Careers</a></li>
                <li className="mb-2"><a href="#" className="text-muted text-decoration-none fs-6">Contact</a></li>
                <li className="mb-2"><a href="#" className="text-muted text-decoration-none fs-6">News</a></li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-6 mb-4">
              <h4 className="fw-bold mb-3 fs-6">Resources</h4>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="#" className="text-muted text-decoration-none fs-6">Documentation</a></li>
                <li className="mb-2"><a href="#" className="text-muted text-decoration-none fs-6">Support</a></li>
                <li className="mb-2"><a href="#" className="text-muted text-decoration-none fs-6">Blog</a></li>
                <li className="mb-2"><a href="#" className="text-muted text-decoration-none fs-6">Tutorials</a></li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-6 mb-4">
              <h4 className="fw-bold mb-3 fs-6">Legal</h4>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="#" className="text-muted text-decoration-none fs-6">Privacy Policy</a></li>
                <li className="mb-2"><a href="#" className="text-muted text-decoration-none fs-6">Terms of Service</a></li>
                <li className="mb-2"><a href="#" className="text-muted text-decoration-none fs-6">Security</a></li>
                <li className="mb-2"><a href="#" className="text-muted text-decoration-none fs-6">Compliance</a></li>
              </ul>
            </div>
          </div>
          <hr className="my-4 border-secondary" />
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <p className="text-muted mb-0 fs-6">&copy; 2025 InsurAI. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Bootstrap CSS CDN */}
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
        rel="stylesheet"
      />
      
      {/* Bootstrap JS CDN */}
      <script 
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
      ></script>
    </div>
  );
};

export default Homepage;