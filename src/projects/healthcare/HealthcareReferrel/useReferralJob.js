// File: src/hooks/useReferralJob.js
import { useEffect, useState } from 'react';
import axios from 'axios';

const useReferralJob = () => {
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [error, setError] = useState(null);

  // Fallback URLs if environment variables are not loaded
  const SUBMIT_API_URL = process.env.REACT_APP_HOMEHEALTH_SUBMIT_API_URL || 
    'https://qtx7687ep4.execute-api.us-east-1.amazonaws.com/Stage/requestapi';
  const STATUS_API_URL = process.env.REACT_APP_HOMEHEALTH_STATUS_API_URL || 
    'https://qtx7687ep4.execute-api.us-east-1.amazonaws.com/Stage/responseapi';

  const handleSubmit = async (s3Paths) => {
    console.log('handleSubmit called with:', s3Paths);
    console.log('Type of s3Paths:', typeof s3Paths);
    
    if (!s3Paths) {
      setError('Please enter at least one S3 path.');
      return;
    }

    const links = s3Paths
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);

    console.log('Parsed links:', links);
    console.log('Number of links:', links.length);

    if (links.length === 0) {
      setError('Please enter at least one S3 path.');
      return;
    }

    setLoading(true);
    setError(null);
    setJobId(null);
    setStatus(null);

    console.log('Making API call to:', SUBMIT_API_URL);
    console.log('With payload:', { links });

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
      if (attempt >= 6) {
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

export default useReferralJob;