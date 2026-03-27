import { useState, useRef } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Navigate } from 'react-router-dom';
import { ArrowLeft, Truck, Upload, FileText, CheckCircle, AlertCircle, Loader, X } from 'lucide-react';

const API_URL = process.env.REACT_APP_SMART_POLICY_API_URL || 'https://k256ugqe2ncdqj2ywja7dso6tu0vsyre.lambda-url.ap-south-1.on.aws/';

const SmartPolicy = () => {
  const { user } = useAuthenticator();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
 
  if (!user) return <Navigate to="/login" replace />;

  const handleFile = (f) => {
    if (f && f.type === 'application/pdf') {
      setFile(f);
      setResult(null);
      setError('');
    } else {
      setError('Please upload a valid PDF file.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setResult(null);


    try {
      const arrayBuffer = await file.arrayBuffer();
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/pdf' },
        body: arrayBuffer,
      });

    //   if (!response.ok) throw new Error(`Server error: ${response.status}`);
      console.log("Okay !",response)
      const data = await response.json();
      console.log(data)
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to process the document.');
    } finally {
      setLoading(false);
    }
  };

  const policyData = result?.response?.data;

  const renderField = (label, value) => {
    if (!value && value !== 0) return null;
    return (
      <div className="flex flex-col gap-1 p-3 bg-gray-50 rounded-lg">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
        <span className="text-sm font-semibold text-gray-900">{value}</span>
      </div>
    );
  };

  const fieldGroups = policyData ? [
    {
      title: '🚗 Vehicle Info',
      fields: [
        ['Make', policyData.make], ['Model', policyData.model], ['Variant', policyData.variant],
        ['Vehicle No', policyData.vehicleNo], ['Chassis No', policyData.chassisNo],
        ['Engine No', policyData.engineNo], ['Fuel Type', policyData.fuelType],
        ['Year of Mfg', policyData.yom], ['Seating Capacity', policyData.seatingCapacity],
        ['GVW/CC', policyData.vehicleCCOrGVW], ['Risk Category', policyData.riskCategory],
        ['RTO City', policyData.rtoCity],
      ]
    },
    {
      title: '📋 Policy Details',
      fields: [
        ['Policy No', policyData.policyNo], ['Product', policyData.productName],
        ['Category', policyData.category], ['Insurance Company', policyData.insuranceCompany],
        ['Inception Date', policyData.inceptionDate], ['Expiry Date', policyData.expiryDate],
        ['Issuance Date', policyData.issuanceDate], ['Prev Insurer', policyData.prevInsurer],
        ['NCB %', policyData.ncbPercentage !== '' ? `${policyData.ncbPercentage}%` : ''],
        ['Intermediary Code', policyData.intermediaryCode], ['POSP Name', policyData.pospName],
      ]
    },
    {
      title: '👤 Customer Info',
      fields: [
        ['Name', policyData.customerName], ['Address 1', policyData.customerAddr1],
        ['Address 2', policyData.customerAddr2], ['City', policyData.customerCity],
        ['Pin Code', policyData.customerPinCode], ['Region', policyData.customerRegion],
        ['Email', policyData.customerEmail], ['Phone', policyData.customerPhone],
        ['GSTIN', policyData.gstin], ['PAN No', policyData.panNo],
      ]
    },
    {
      title: '💰 Premium Breakdown',
      fields: [
        ['Sum Assured', policyData.sumAssured ? `₹${policyData.sumAssured.toLocaleString()}` : ''],
        ['Gross Premium', policyData.grossPremium ? `₹${policyData.grossPremium.toLocaleString()}` : ''],
        ['Total OD', policyData.totalOD ? `₹${policyData.totalOD.toLocaleString()}` : ''],
        ['Third Party', policyData.thirdParty ? `₹${policyData.thirdParty.toLocaleString()}` : ''],
        ['Passenger', policyData.passanger ? `₹${policyData.passanger.toLocaleString()}` : ''],
        ['Other Liability', policyData.otherLiabilityPremium ? `₹${policyData.otherLiabilityPremium.toLocaleString()}` : ''],
        ['Service Tax', policyData.serviceTaxAmt ? `₹${policyData.serviceTaxAmt.toLocaleString()}` : ''],
        ['Tax %', policyData.serviceTaxPercent ? `${policyData.serviceTaxPercent}%` : ''],
        ['Amount', policyData.amount ? `₹${policyData.amount.toLocaleString()}` : ''],
      ]
    },
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button onClick={() => window.history.back()} className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Truck className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Smart Policy Processor</h1>
                  <p className="text-sm text-gray-500">Extract structured data from insurance policy PDFs</p>
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-500">Welcome, {user?.attributes?.email || user?.username}</div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Card - hide when result is shown */}
        {!result && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-6">
            <div className="flex items-center gap-3 text-white">
              <FileText className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Upload Policy Document</h2>
                <p className="text-orange-100 mt-1">Upload a PDF to extract all policy details automatically</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Drop Zone */}
            <div
              onClick={() => fileInputRef.current.click()}
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
                dragOver ? 'border-orange-400 bg-orange-50' : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50'
              }`}
            >
              <Upload className="w-12 h-12 text-orange-400 mx-auto mb-3" />
              <p className="text-gray-700 font-medium">Drag & drop your PDF here or click to browse</p>
              <p className="text-sm text-gray-400 mt-1">Only PDF files are supported</p>
              <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
            </div>

            {/* Selected File */}
            {file && (
              <div className="mt-4 flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-200">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-gray-800">{file.name}</span>
                  <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                </div>
                <button onClick={() => { setFile(null); setResult(null); setError(''); }} className="text-gray-400 hover:text-red-500 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mt-4 flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-200 text-red-800">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!file || loading}
              className="mt-6 w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {loading ? <><Loader className="w-5 h-5 animate-spin" /> Processing...</> : <><Upload className="w-5 h-5" /> Process Policy</>}
            </button>
          </div>
        </div>
        )} {/* end !result */}

        {/* Results */}
        {result?.success && policyData && (
          <div className="space-y-6">
            {/* New Upload Button */}
            <div className="flex justify-end">
              <button
                onClick={() => { setFile(null); setResult(null); setError(''); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all font-semibold shadow-md hover:shadow-lg"
              >
                <Upload className="w-4 h-4" /> New Upload
              </button>
            </div>

            {/* Summary Banner */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-4">
                <div className="flex items-center gap-3 text-white">
                  <CheckCircle className="w-6 h-6" />
                  <div>
                    <h3 className="text-lg font-bold">Policy Extracted Successfully</h3>
                    <p className="text-green-100 text-sm">{result.response.count} fields extracted · {result.response.company}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {renderField('Policy No', policyData.policyNo)}
                {renderField('Category', policyData.category)}
                {renderField('Expiry Date', policyData.expiryDate)}
                {renderField('Gross Premium', policyData.grossPremium ? `₹${policyData.grossPremium.toLocaleString()}` : '')}
              </div>
            </div>

            {/* Field Groups */}
            {fieldGroups.map((group) => (
              <div key={group.title} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">{group.title}</h3>
                </div>
                <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {group.fields.map(([label, value]) => renderField(label, value))}
                </div>
              </div>
            ))}

            {/* Raw JSON */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">📊 Raw JSON Response</h3>
              </div>
              <div className="p-6">
                <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-xs overflow-auto max-h-96">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartPolicy;
