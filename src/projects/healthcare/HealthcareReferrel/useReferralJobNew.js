import { useEffect, useState } from 'react';
import axios from 'axios';

const useReferralJobNew = () => {
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [error, setError] = useState(null);

  const SUBMIT_API_URL = process.env.REACT_APP_HOMEHEALTH_SUBMIT_API_URL;
  const STATUS_API_URL = process.env.REACT_APP_HOMEHEALTH_STATUS_API_URL;

  const handleSubmit = async (s3PathsInput) => {
    console.log('NEW handleSubmit called with:', s3PathsInput);
    console.log('Type:', typeof s3PathsInput);
    
    if (!s3PathsInput || typeof s3PathsInput !== 'string') {
      setError('Please enter at least one S3 path.');
      return;
    }

    const links = s3PathsInput
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);

    console.log('Parsed links:', links);

    if (links.length === 0) {
      setError('Please enter at least one S3 path.');
      return;
    }

    setLoading(true);
    setError(null);
    setJobId(null);
    setStatus(null);

    console.log('Making API call to:', SUBMIT_API_URL);

    try {
      const response = await axios.post(
        SUBMIT_API_URL,
        { links },
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('API Response:', response);

      if (response.status === 200) {
        setJobId(response.data.job_id);
        setPolling(true);
      } else {
        setError(`Submission failed: ${response.statusText}`);
      }
    } catch (err) {
      console.error('API Error:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!jobId || !polling) return;

    const pollStatus = async (attempt = 0) => {
      if (attempt >= 12) {
        setError('Job still in progress. Please check again later.');
        setPolling(false);
        return;
      }

      try {
        const res = await axios.post(
          STATUS_API_URL,
          { job_id: jobId },
          { headers: { 'Content-Type': 'application/json' } }
        );

        if (res.status === 200) {
          setStatus(res.data);
          setPolling(false);
        } else if (res.status === 202) {
          setTimeout(() => pollStatus(attempt + 1), attempt === 0 ? 6000 : 15000);
        } else {
          setError(`Status check failed: ${res.statusText}`);
          setPolling(false);
        }
      } catch (err) {
        setError(`Polling error: ${err.message}`);
        setPolling(false);
      }
    };

    pollStatus();
  }, [jobId, polling, STATUS_API_URL]);

  return {
    jobId,
    status,
    loading,
    polling,
    error,
    handleSubmit
  };
};

export default useReferralJobNew;
