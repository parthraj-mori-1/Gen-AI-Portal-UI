import { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import './immigration.css';

const Field = ({ label, value }) => {
  if (!value || value === ' ' || value === '') return null;
  return (
    <div style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: 8, marginBottom: 4 }}>
      <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', marginTop: 2 }}>{value}</div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 12, overflow: 'hidden' }}>
    <div style={{ padding: '10px 16px', background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', fontWeight: 700, fontSize: 13, color: '#334155' }}>{title}</div>
    <div style={{ padding: 12, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 6 }}>{children}</div>
  </div>
);

const ApplicantCard = ({ applicant, index }) => {
  const [expanded, setExpanded] = useState(false);
  const a = applicant;
  const info = a.applicant_info || {};
  const contact = a.contact_information_info?.address || {};
  const passports = Array.isArray(a.passport_info) ? a.passport_info : (a.passport_info ? [a.passport_info] : []);
  const academics = a.academics_info || [];
  const transcripts = a.transcript_certificate_info || [];
  const insurance = Array.isArray(a.insurance_info) ? a.insurance_info : (a.insurance_info ? [a.insurance_info] : []);
  const english = a.english_test_info || {};
  const ausQual = Array.isArray(a.australian_qualification_info) ? a.australian_qualification_info : (a.australian_qualification_info ? [a.australian_qualification_info] : []);
  const employment = a.employment_history || [];

  return (
    <div style={{ marginBottom: 16, border: '2px solid #6366f1', borderRadius: 16, overflow: 'hidden' }}>
      {/* Clickable header */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{ width: '100%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', padding: '14px 20px', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>
            {index === 0 ? '👤 Primary Applicant' : `👤 Applicant ${index + 1}`}: {info.firstname} {info.lastname}
          </div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>DOB: {info.dateofbirth} · Gender: {info.gender}</div>
        </div>
        <span style={{ fontSize: 20, transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
      </button>

      {/* Scrollable content */}
      {expanded && (
        <div style={{ padding: 16, maxHeight: '60vh', overflowY: 'auto' }}>
        {/* Contact */}
        {contact.address && (
          <Section title="📍 Address">
            <Field label="Address" value={contact.address} />
            <Field label="City" value={contact.city} />
            <Field label="State" value={contact.state} />
            <Field label="Country" value={contact.country} />
            <Field label="Zip" value={contact.zipcode} />
          </Section>
        )}

        {/* Passport */}
        {passports.map((p, i) => (
          <Section key={i} title={`🛂 Passport ${passports.length > 1 ? i + 1 : ''}`}>
            <Field label="Passport No" value={p.passport_number} />
            <Field label="Given Name" value={p.given_name} />
            <Field label="Surname" value={p.surname} />
            <Field label="DOB" value={p.dateofbirth} />
            <Field label="Place of Birth" value={p.place_of_birth} />
            <Field label="Place of Issue" value={p.place_of_issue} />
            <Field label="Date of Issue" value={p.date_of_issue} />
            <Field label="Date of Expiry" value={p.date_of_expiry} />
          </Section>
        ))}

        {/* Academics */}
        {academics.length > 0 && academics.some(ac => ac.qualification) && (
          <Section title="🎓 Academic History">
            {academics.filter(ac => ac.qualification).map((ac, i) => (
              <div key={i} style={{ gridColumn: '1 / -1', background: '#f8fafc', borderRadius: 8, padding: '8px 12px', marginBottom: 4 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#1e293b' }}>{ac.qualification} — {ac.course_name}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{ac.institution_name}, {ac.institution_country} · {ac.passing_month}/{ac.passing_year} · Grade: {ac.grade}</div>
              </div>
            ))}
          </Section>
        )}

        {/* English Test */}
        {english.test_type && (
          <Section title="🗣️ English Test">
            <Field label="Test Type" value={english.test_type} />
            <Field label="Test Date" value={english.test_date} />
            <Field label="Valid Until" value={english.valid_until_date || english.Valid_Until_date} />
            <Field label="Overall Score" value={english.overall_result} />
            <Field label="Listening" value={english.result?.listening} />
            <Field label="Reading" value={english.result?.reading} />
            <Field label="Writing" value={english.result?.writing} />
            <Field label="Speaking" value={english.result?.speaking} />
          </Section>
        )}

        {/* Insurance */}
        {insurance.map((ins, i) => ins.provider_name && (
          <Section key={i} title="🏥 Insurance">
            <Field label="Type" value={ins.insurance_type} />
            <Field label="Provider" value={ins.provider_name} />
            <Field label="Policy No" value={ins.policy_no} />
            <Field label="Policy Type" value={ins.policy_type} />
            <Field label="Start Date" value={ins.policy_startdate} />
            <Field label="End Date" value={ins.policy_enddate} />
          </Section>
        ))}

        {/* Australian Qualification */}
        {ausQual.map((aq, i) => aq.provider && (
          <Section key={i} title="🇦🇺 Australian Qualification">
            <Field label="Provider" value={aq.provider} />
            <Field label="Course" value={aq.course} />
            <Field label="Level" value={aq.course_level} />
            <Field label="Start Date" value={aq.course_startdate} />
            <Field label="End Date" value={aq.course_enddate} />
            <Field label="Total Tuition Fee" value={aq.total_tuition_fee} />
          </Section>
        ))}

        {/* Employment */}
        {employment.length > 0 && employment.some(e => e.employer_name?.trim()) && (
          <Section title="💼 Employment History">
            {employment.filter(e => e.employer_name?.trim()).map((e, i) => (
              <div key={i} style={{ gridColumn: '1 / -1', background: '#f8fafc', borderRadius: 8, padding: '8px 12px', marginBottom: 4 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#1e293b' }}>{e.position} — {e.employer_name}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                  {e.joining_month}/{e.joining_year} → {e.resignation_month || e['resignation-month']}/{e.resignation_year || e['resignation-year']}
                </div>
              </div>
            ))}
          </Section>
        )}
        </div>
      )}
    </div>
  );
};

const ImmigrationExtractor = () => {
  const { user } = useAuthenticator();
  const [s3Path, setS3Path] = useState(
    process.env.REACT_APP_IMMIGRATION_S3_BUCKET || 'https://genai-konze-student-documents.s3.ap-south-1.amazonaws.com/Gopi+CHATTI+2/'
  );
  const [jobId, setJobId] = useState('');
  const [statusMessages, setStatusMessages] = useState([]);
  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showResult, setShowResult] = useState(true);

  const MAX_ATTEMPTS = 10;

  const handleSubmit = async () => {
    if (!s3Path.trim()) {
      setError('Please enter a valid S3 path.');
      return;
    }

    const SUBMIT_URL = process.env.REACT_APP_IMMIGRATION_SUBMIT_URL || 
      'https://ol9jaj3n8e.execute-api.ap-south-1.amazonaws.com/Stage/requestapi';

    // console.log('Immigration Submit URL:', SUBMIT_URL);
    // console.log('S3 Path:', s3Path);

    setIsSubmitting(true);
    setError('');
    setResult(null);
    setStatusMessages([]);
    setAttempts(0);

    try {
      const response = await axios.post(
        SUBMIT_URL,
        { link: s3Path },
        { headers: { 'Content-Type': 'application/json' } }
      );

      // console.log('Submit Response:', response);

      if (response.status === 200) {
        setJobId(response.data);
        setAttempts(1);
      }
    } catch (err) {
      console.error('Submit Error:', err);
      setError(`Submission failed: ${err.response?.data || err.message}`);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const checkStatus = async () => {
      if (!jobId || attempts > MAX_ATTEMPTS) return;

      try {
        const response = await axios.post(
          process.env.REACT_APP_IMMIGRATION_STATUS_URL,
          { job_id: jobId },
          { headers: { 'Content-Type': 'application/json' } }
        );

        if (response.status === 200) {
          setResult(response.data);
          setIsSubmitting(false);
        } else if (response.status === 202) {
          const message = response.data.message || 'Processing...';
          setStatusMessages(prev => {
            if (!prev.includes(message)) {
              return [...prev, message];
            }
            return prev;
          });
          setTimeout(() => setAttempts(a => a + 1), attempts === 1 ? 6000 : 15000);
        }
      } catch (err) {
        setError(`Error fetching status: ${err.response?.data || err.message}`);
        setIsSubmitting(false);
      }
    };

    checkStatus();
  }, [jobId, attempts]);

  const handleClear = () => {
    setS3Path('');
  };

  const handleLoadSample = () => {
    setS3Path('https://genai-konze-student-documents.s3.ap-south-1.amazonaws.com/Gopi+CHATTI+2/');
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="immigration-page">
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: `url('/bg-genai.jpeg')`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          zIndex: 0
        }}
      />
      
      <div className="immigration-container">
        {/* Header Section */}
        <div className="immigration-header">
          <div className="header-icon">🌍</div>
          <h1 className="immigration-title">Immigration Information Extraction</h1>
          <p className="immigration-subtitle">
            Automated extraction of immigration documents and student information
          </p>
        </div>

        {/* Input Section — hide when result shown */}
        {!result && (
          <>
        <div className="input-section">
          <div className="input-header">
            <label htmlFor="s3-input" className="input-label">
              📁 S3 Student Folder Path
            </label>
            <div className="input-actions">
              <button 
                onClick={handleLoadSample} 
                className="action-btn sample-btn"
                type="button"
              >
                📋 Load Sample
              </button>
              <button 
                onClick={handleClear} 
                className="action-btn clear-btn"
                type="button"
              >
                🗑️ Clear
              </button>
            </div>
          </div>
          
          <textarea
            id="s3-input"
            rows={4}
            value={s3Path}
            onChange={(e) => setS3Path(e.target.value)}
            className="s3-textarea"
            placeholder="Enter S3 folder path&#10;Example: s3://bucket-name/student-folder/"
          />
          
          <div className="input-info">
            <span className="info-icon">ℹ️</span>
            <span className="info-text">
              Enter the S3 path to the folder containing student immigration documents.
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button 
          onClick={handleSubmit} 
          disabled={isSubmitting} 
          className="submit-button"
        >
          {isSubmitting ? (
            <>
              <span className="spinner"></span>
              Processing...
            </>
          ) : (
            <>
              <span className="button-icon">🚀</span>
              Extract Information
            </>
          )}
        </button>

        {/* Status Messages */}
        {jobId && !error && !result && (
          <div className="status-message success-message">
            <span className="status-icon">✅</span>
            <div className="status-content">
              <strong>Job Submitted Successfully!</strong>
              <p className="status-detail">Job ID: {jobId}</p>
            </div>
          </div>
        )}

        {statusMessages.map((msg, index) => (
          <div key={index} className="status-message info-message">
            <span className="status-icon">🔄</span>
            <div className="status-content">
              <strong>Processing</strong>
              <p className="status-detail">{msg}</p>
            </div>
          </div>
        ))}

        {error && (
          <div className="status-message error-message">
            <span className="status-icon">❌</span>
            <div className="status-content">
              <strong>Error</strong>
              <p className="status-detail">{error}</p>
            </div>
          </div>
        )}

        {attempts >= MAX_ATTEMPTS && !result && (
          <div className="status-message warning-message">
            <span className="status-icon">⚠️</span>
            <div className="status-content">
              <strong>Still Processing</strong>
              <p className="status-detail">Job is taking longer than expected. Please check again later.</p>
            </div>
          </div>
        )}
          </>
        )}

        {/* Results Section */}
        {result && (
          <div className="results-section">
            {/* New Extraction button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
              <button
                onClick={() => { setResult(null); setJobId(''); setStatusMessages([]); setError(''); setAttempts(0); }}
                className="submit-button"
                style={{ width: 'auto', padding: '10px 24px' }}
                type="button"
              >
                🔄 New Extraction
              </button>
            </div>
            <div className="results-header">
              <div className="results-title-wrapper">
                <span className="results-icon">🎉</span>
                <h3 className="results-title">Extraction Complete</h3>
              </div>
              <button className="toggle-results-btn" onClick={() => setShowResult(!showResult)} type="button">
                {showResult ? '👁️ Hide' : '👁️‍🗨️ Show'} Details
              </button>
            </div>

            {showResult && (
              <div className="results-content">
                {(Array.isArray(result) ? result : [result]).map((applicant, idx) => (
                  <ApplicantCard key={idx} applicant={applicant} index={idx} />
                ))}
                {/* Raw JSON */}
                <div style={{ marginTop: 16 }}>
                  <h4 className="data-title">📊 Raw JSON</h4>
                  <pre className="data-json">{JSON.stringify(result, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImmigrationExtractor;