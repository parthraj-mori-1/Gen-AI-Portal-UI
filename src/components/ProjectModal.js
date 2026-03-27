import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Activity, Share2, Eye, Check, ArrowRight, Database, Copy, Download, FileText, BookOpen, Video, ExternalLink, MessageSquare, Send, Loader } from 'lucide-react';

const sectionConfig = {
  healthcare:    { color: '#10b981', bg: '#ecfdf5', text: '#065f46', tagBg: '#d1fae5', label: 'Healthcare',    gradient: 'linear-gradient(135deg, #10b981, #059669)' },
  education:     { color: '#3b82f6', bg: '#eff6ff', text: '#1e40af', tagBg: '#dbeafe', label: 'Education',     gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
  transportation:{ color: '#f59e0b', bg: '#fffbeb', text: '#78350f', tagBg: '#fef3c7', label: 'Transportation',gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
  fintech:       { color: '#ec4899', bg: '#fdf2f8', text: '#831843', tagBg: '#fce7f3', label: 'Fintech',       gradient: 'linear-gradient(135deg, #ec4899, #db2777)' },
  security:      { color: '#64748b', bg: '#f1f5f9', text: '#1e293b', tagBg: '#e2e8f0', label: 'Security',      gradient: 'linear-gradient(135deg, #64748b, #475569)' },
  other:         { color: '#8b5cf6', bg: '#f5f3ff', text: '#4c1d95', tagBg: '#ede9fe', label: 'Other',         gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
};

const inputSources = {
  '/healthcare/referral':         { type: 'text', label: 'Sample S3 Paths',        value: 's3://chartmate-idp-deployment-1/inbound+15.pdf\ns3://chartmate-idp-deployment-1/8df068b1-1fab-48e1-83bb-884f92267cb7.pdf' },
  '/healthcare/patient-summary':  { type: 'text', label: 'Sample Patient ID',      value: 'P001\nP002\nP003' },
  '/healthcare/medical-assistant':{ type: 'text', label: 'Sample Query',           value: 'Hello, my son’s name is Stefen and he is 5 years old.He weighs approximately 18 kg and his height is around 108 cm.He has been experiencing a cough for the past 3–4 days, especially noticeable at night. The cough is dry in nature, with no mucus production. He also has a mild sore throat but no fever. His appetite is slightly reduced, and he feels a bit tired, but he is otherwise active.' },
  '/healthcare/health':           { type: 'text', label: 'Sample Query',           value: 'Summarize the health records for patient ID 10234 and flag any critical conditions.' },
  '/Education/smart-documents':   { type: 'link', label: 'Sample Document URLs',   value: [{ label: 'Sample Policy PDF', url: 'https://workdrive.operisoft.com/external/f13c92fad34a5fa460bbfade1e11ec24f06eab8b5aa6f169545eafe55984e830' }] },
  '/Education/immigration':       { type: 'text', label: 'Sample S3 links',    value: 'https://genai-konze-student-documents.s3.ap-south-1.amazonaws.com/Gopi+CHATTI+2/' },
  '/other/recruiterai':           { type: 'link', label: 'Sample Resumes', value: [{ label: 'Resume-I', url: 'https://workdrive.operisoft.com/external/ca0fa10145761f57d6c1c46605d2eac7cc371f3054d77e74bd0c9b8391ea5858' }, { label: 'Resume-II', url: 'https://workdrive.operisoft.com/external/6c6efc301a6b25bcd65ff671cb25c72dc1a66ea66bc69c65273da2b7104c790d' }] },
  '/other/voicebot':              { type: 'text', label: 'Sample Voice Prompt',    value: 'Explain the difference between Google Cloud Run and Google Kubernetes Engine. When should I use each one?' },
  '/transportation/smart-policy': { type: 'link', label: 'Sample PDF',    value: [{label:"Sample-I",url:"https://workdrive.operisoft.com/external/cd3b8a00eb2986dd3a64a242baaca4b87b37ce3ef720f34cca40eb2b4725101c"},{label:"Sample-II",url:"https://workdrive.operisoft.com/external/c004c812e253550906a6c69185416fbf581bfacf69183429ebbd6d0709988607"},{label:"Sample-III",url:"https://workdrive.operisoft.com/external/22bcf2dbb13f7e612d397c60ad343d0cb1cb77a1676cc28a4d12f0b41ca673ce"}] },
  '/security':              { type: 'text', label: 'Aws Credential Role',   value: 'arn:aws:iam::540757658793:role/Aws-security-role' },
  '/other/convogenai':            { type: 'link', label: 'Sample input files', value: [{label : 'Sample Pdf', url: 'https://workdrive.operisoft.com/external/81edadc8558df0dcd343292815a7fec43481a48e23cb41d60064ca7f29895396'},{label :'Sample Excel', url:'https://workdrive.operisoft.com/external/a5af8edc61f618d788b43ab0fbcd41fec3531f1f4969373760ef386edf10f338'}]},
};

const projectResources = {
  '/healthcare/referral':         { docs: [{ label: 'Not Available', url: '' }],                                                                                                                                                                    recordings: [] },
  '/healthcare/patient-summary':  { docs: [{ label: 'Not Available', url: '' }],                                                                                                                                                                    recordings: [] },
  '/healthcare/medical-assistant':{ docs: [{ label: 'Not Available', url: '' }],                                                                                                                                                                    recordings: [{ label: 'Demo Walkthrough', url: 'https://workdrive.operisoft.com/external/8dd995c4e79672bfcf6ee38ad6ce7a8067e58429d8d76581c3eac94f85e41135' }] },
  '/healthcare/health':           { docs: [{ label: 'Not Available', url: '' }],                                                                                                                                                                    recordings: [] },
  '/Education/smart-documents':   { docs: [{ label: 'Not Available', url: '' }],                                                                                                                                                                    recordings: [] },
  '/Education/immigration':       { docs: [{ label: 'Not Available', url: '' }],                                                                                                                                                                    recordings: [] },
  '/other/recruiterai':           { docs: [{ label: 'Not Available', url: '' }],                                                                                                                                                                    recordings: [] },
  '/other/voicebot':              { docs: [{ label: 'Gemini API Docs', url: 'https://ai.google.dev/gemini-api/docs' }],                                                                                                                             recordings: [] },
  '/transportation/smart-policy': { docs: [{ label: 'Not Available', url: '' }],                                                                                                                                                                    recordings: [] },
  '/security':              { docs: [{ label: 'Not Available', url: '' }],                                                                                                                                                                    recordings: [{ label: 'Demo Walkthrough', url: 'https://workdrive.operisoft.com/external/a40859852c01ef72f99c50ad187dcd7a8e4a21f9d9a6aeb4d8f561a572355b6c' }] },

};

const projectCredentials = {
  '/healthcare/health':  { username: 'Operisoft-demo', password: 'Operisoft1803@' },
  '/other/convogenai':   { username: 'sales_user@operisoft.com', password: 'Admin@123' },
};

const CredentialField = ({ label, value, color }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); });
  };
  return (
    <div className="flex items-center justify-between gap-2 bg-white rounded-lg px-3 py-2 border border-gray-100">
      <div className="min-w-0">
        <p className="text-gray-400 font-medium text-xs">{label}</p>
        <p className="font-semibold text-gray-800 text-xs mt-0.5 truncate">{value ?? '—'}</p>
      </div>
      {value && (
        <button onClick={copy} className="flex-shrink-0 p-1 rounded-md hover:bg-gray-100 transition-colors">
          {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-gray-400" />}
        </button>
      )}
    </div>
  );
};

const InputSourcePopup = ({ source, color, onClose }) => {
  const [copied, setCopied] = useState(false);
  const isMultiLink = source.type === 'link' && Array.isArray(source.value);
  const copyText = isMultiLink ? source.value.map(l => l.url).join('\n') : source.value;

  const handleCopy = () => {
    navigator.clipboard.writeText(copyText).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const handleDownload = () => {
    if (isMultiLink) {
      const blob = new Blob([copyText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'links.txt'; a.click();
      URL.revokeObjectURL(url);
    } else if (source.type === 'link') {
      const a = document.createElement('a');
      a.href = source.value; a.target = '_blank'; a.rel = 'noopener noreferrer';
      a.download = source.value.split('/').pop() || 'download'; a.click();
    } else {
      const ext = source.type === 'json' ? 'json' : 'txt';
      const mime = source.type === 'json' ? 'application/json' : 'text/plain';
      const blob = new Blob([source.value], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `source.${ext}`; a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }} className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.2)' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
              <Database className="w-4 h-4" style={{ color }} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Sample Input</p>
              <p className="text-xs text-gray-400">{source.label}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide" style={{ background: `${color}15`, color }}>{source.type}</span>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 font-mono text-xs text-gray-700 break-all leading-relaxed whitespace-pre-wrap" style={{ maxHeight: 220, overflowY: 'auto' }}>
            {isMultiLink ? (
              <div className="space-y-3">
                {source.value.map((link, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-gray-400 flex-shrink-0">{i + 1}.</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-600 mb-0.5">{link.label}</p>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all hover:text-blue-800">{link.url}</a>
                    </div>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 mt-4">
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400 hover:text-blue-500" />
                    </a>
                  </div>
                ))}
              </div>
            ) : source.type === 'link' ? (
              <a href={source.value} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all hover:text-blue-800">{source.value}</a>
            ) : source.value}
          </div>
          <div className="flex gap-2 mt-4">
            <motion.button whileTap={{ scale: 0.97 }} onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all">
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </motion.button>
            <motion.button whileTap={{ scale: 0.97 }} onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-semibold transition-all"
              style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}>
              <Download className="w-4 h-4" /> Download
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ResourcesPopup = ({ resources, color, onClose }) => (
  <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
    transition={{ type: 'spring', stiffness: 400, damping: 30 }} className="fixed inset-0 z-[70] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
    <div className="relative w-full max-w-sm bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.2)' }}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
            <BookOpen className="w-4 h-4" style={{ color }} />
          </div>
          <p className="text-sm font-bold text-gray-900">Resources</p>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"><X className="w-4 h-4" /></button>
      </div>
      <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
        {resources.docs?.length > 0 && (
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Documentation</p>
            <div className="space-y-2">
              {resources.docs.map((doc, i) => (
                <a key={i} href={doc.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all group">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}15` }}>
                    <FileText className="w-3.5 h-3.5" style={{ color }} />
                  </div>
                  <p className="text-sm font-semibold text-gray-800 flex-1">{doc.label}</p>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}
        {resources.recordings?.length > 0 && (
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Screen Recordings</p>
            <div className="space-y-2">
              {resources.recordings.map((rec, i) => (
                <a key={i} href={rec.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all group">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}15` }}>
                    <Video className="w-3.5 h-3.5" style={{ color }} />
                  </div>
                  <p className="text-sm font-semibold text-gray-800 flex-1">{rec.label}</p>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </motion.div>
);

const FeedbackPopup = ({ project, color, gradient, onClose }) => {
  const [form, setForm] = useState({ name: '', email: '', issue: '', rating: 0, status: '', feedback: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const statusOptions = ['Working Fine', 'Minor Issues', 'Major Issues', 'Not Working', 'Needs Improvement'];

  const handleSend = async () => {
    if (!form.issue || !form.rating || !form.status) return;
    setSending(true);
    try {
      const res = await fetch(process.env.REACT_APP_FEEDBACK_API_URL || 'https://272yfjx65umkjqituaisgbfeom0bwctk.lambda-url.ap-south-1.on.aws/', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, project: project.title, status: form.status, rating: form.rating, issue: form.issue, feedback: form.feedback }),
      });
      const data = await res.json();
      if (data.success) { setSent(true); setTimeout(onClose, 1500); }
      else alert('Failed to send: ' + (data.error || 'Unknown error'));
    } catch (err) { alert('Error: ' + err.message); }
    finally { setSending(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }} className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.2)', maxHeight: '90vh' }}>
        <div className="p-5 text-white relative" style={{ background: gradient }}>
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"><X className="w-4 h-4 text-white" /></button>
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5 text-white/80" />
            <div><p className="text-sm font-bold text-white">Project Feedback</p><p className="text-xs text-white/70">{project.title}</p></div>
          </div>
        </div>
        {sent ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3"><Check className="w-7 h-7 text-green-500" /></div>
            <p className="text-base font-bold text-gray-900">Feedback Sent!</p>
            <p className="text-sm text-gray-400 mt-1">Thank you for your response.</p>
          </div>
        ) : (
          <div className="p-5 space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 100px)' }}>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-semibold text-gray-500 mb-1 block">Your Name</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="John Doe" className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-blue-400 transition-colors" /></div>
              <div><label className="text-xs font-semibold text-gray-500 mb-1 block">Your Email</label>
                <input value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-blue-400 transition-colors" /></div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-2 block">Project Status <span className="text-red-400">*</span></label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map(s => (
                  <button key={s} onClick={() => set('status', s)} className="text-xs px-3 py-1.5 rounded-full border font-medium transition-all"
                    style={form.status === s ? { background: color, color: 'white', borderColor: color } : { background: 'white', color: '#6b7280', borderColor: '#e5e7eb' }}>{s}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-2 block">Rating <span className="text-red-400">*</span></label>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(star => (
                  <button key={star} onClick={() => set('rating', star)} className="text-2xl transition-transform hover:scale-110" style={{ color: star <= form.rating ? '#f59e0b' : '#d1d5db' }}>★</button>
                ))}
                {form.rating > 0 && <span className="text-xs text-gray-400 self-center ml-1">{form.rating}/5</span>}
              </div>
            </div>
            <div><label className="text-xs font-semibold text-gray-500 mb-1 block">Issue Faced <span className="text-red-400">*</span></label>
              <textarea value={form.issue} onChange={e => set('issue', e.target.value)} rows={3} placeholder="Describe any issue or problem you encountered..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-blue-400 transition-colors resize-none" /></div>
            <div><label className="text-xs font-semibold text-gray-500 mb-1 block">Additional Feedback</label>
              <textarea value={form.feedback} onChange={e => set('feedback', e.target.value)} rows={2} placeholder="Suggestions, improvements, or general comments..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-blue-400 transition-colors resize-none" /></div>
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={handleSend}
              disabled={!form.issue || !form.rating || !form.status || sending}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: gradient }}>
              {sending ? <><Loader className="w-4 h-4 animate-spin" /> Sending...</> : <><Send className="w-4 h-4" /> Send Feedback</>}
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const ProjectModal = ({ project, onClose }) => {
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showSource, setShowSource] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = 'unset'; window.removeEventListener('keydown', onKey); };
  }, [onClose]);

  if (!project) return null;

  const cfg = sectionConfig[project.section] || sectionConfig.other;
  const source = inputSources[project.url];
  const resources = projectResources[project.url];
  const credentials = projectCredentials[project.url];

  const handleAccess = () => { navigate(project.url); onClose(); };
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + project.url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

        <motion.div initial={{ opacity: 0, scale: 0.94, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          className="relative w-full max-w-xl max-h-[88vh] flex flex-col bg-white rounded-2xl overflow-hidden"
          style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.18)' }}>

          <div className="relative p-6 text-white" style={{ background: cfg.gradient }}>
            <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"><X className="w-4 h-4 text-white" /></button>
            <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 text-white mb-3">{cfg.label}</span>
            <h3 className="text-xl font-bold text-white leading-tight">{project.title}</h3>
            <p className="text-sm text-white/80 mt-1.5 leading-relaxed pr-8">{project.description}</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-white">
            <div className="grid grid-cols-3 gap-3">
              <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => source && setShowSource(true)}
                className="rounded-xl p-3.5 text-center cursor-pointer transition-all"
                style={{ background: cfg.bg, border: `1.5px solid ${cfg.color}55`, boxShadow: `0 2px 8px ${cfg.color}20` }}>
                <Database className="w-4 h-4 mx-auto mb-1.5" style={{ color: cfg.color }} />
                <p className="text-sm font-bold leading-tight" style={{ color: cfg.text }}>Source</p>
                <p className="text-xs mt-0.5" style={{ color: cfg.color, opacity: 0.7 }}>Input Source ↗</p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => setShowFeedback(true)}
                className="rounded-xl p-3.5 text-center cursor-pointer transition-all"
                style={{ background: cfg.bg, border: `1.5px solid ${cfg.color}55`, boxShadow: `0 2px 8px ${cfg.color}20` }}>
                <Activity className="w-4 h-4 mx-auto mb-1.5" style={{ color: cfg.color }} />
                <p className="text-sm font-bold leading-tight capitalize" style={{ color: cfg.text }}>{project.status}</p>
                <p className="text-xs mt-0.5" style={{ color: cfg.color, opacity: 0.7 }}>Feedback ↗</p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => resources && setShowResources(true)}
                className="rounded-xl p-3.5 text-center cursor-pointer transition-all"
                style={{ background: cfg.bg, border: `1.5px solid ${cfg.color}55`, boxShadow: `0 2px 8px ${cfg.color}20` }}>
                <BookOpen className="w-4 h-4 mx-auto mb-1.5" style={{ color: cfg.color }} />
                <p className="text-sm font-bold leading-tight" style={{ color: cfg.text }}>Docs & Demo</p>
                <p className="text-xs mt-0.5" style={{ color: cfg.color, opacity: 0.7 }}>Resources ↗</p>
              </motion.div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">Features & Technologies</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, i) => (
                  <span key={i} className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{ background: cfg.tagBg, color: cfg.text }}>{tag}</span>
                ))}
              </div>
            </div>

            <AnimatePresence>
              {showPreview && project.previewImages?.length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">Screenshots</p>
                  <div className="grid grid-cols-2 gap-3">
                    {project.previewImages.map((img, i) => (
                      <motion.div key={i} whileHover={{ scale: 1.02 }} onClick={() => setSelectedImage(img)} className="rounded-xl overflow-hidden border border-gray-100 cursor-zoom-in shadow-sm">
                        <img src={img} alt={`Preview ${i + 1}`} className="w-full h-36 object-cover" />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">Quick Start</p>
              <div className="space-y-2.5">
                {credentials && (
                  <div className="rounded-xl border p-3.5 mb-1" style={{ background: cfg.bg, borderColor: `${cfg.color}33` }}>
                    <p className="text-xs font-bold mb-2" style={{ color: cfg.color }}>🔐 Login Credentials</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[['Username', credentials.username], ['Password', credentials.password]].map(([label, val]) => (
                        <CredentialField key={label} label={label} value={val} color={cfg.color} />
                      ))}
                    </div>
                  </div>
                )}
                {[
                  { icon: Database, label: 'Source',      desc: 'Click "Source ↗" to view sample test data you can copy or download and use directly in the project.' },
                  { icon: Activity, label: 'Feedback',    desc: 'Click "Feedback ↗" to report issues, rate the project, and send your feedback directly to the team.' },
                  { icon: BookOpen, label: 'Docs & Demo', desc: 'Click "Docs & Demo ↗" to access documentation and screen recordings to understand how the project works.' },
                ].map(({ icon: Icon, label, desc }, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5" style={{ background: cfg.color }}>{i + 1}</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{label}</p>
                      <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3">
            <div className="flex gap-2">
              <motion.button whileTap={{ scale: 0.97 }} onClick={handleShare}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 transition-all font-medium shadow-sm">
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Share'}
              </motion.button>
              {project.previewImages?.length > 0 && (
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 transition-all font-medium shadow-sm">
                  <Eye className="w-4 h-4" />{showPreview ? 'Hide' : 'Preview'}
                </motion.button>
              )}
            </div>
            <motion.button
              whileHover={project.status === 'Active' ? { scale: 1.02 } : {}}
              whileTap={project.status === 'Active' ? { scale: 0.98 } : {}}
              onClick={project.status === 'Active' ? handleAccess : undefined}
              disabled={project.status !== 'Active'}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm shadow-md transition-shadow disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none hover:shadow-lg"
              style={{ background: cfg.gradient }}>
              Access Project <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

        <AnimatePresence>
          {showFeedback && <FeedbackPopup project={project} color={cfg.color} gradient={cfg.gradient} onClose={() => setShowFeedback(false)} />}
        </AnimatePresence>
        <AnimatePresence>
          {showSource && source && <InputSourcePopup source={source} color={cfg.color} onClose={() => setShowSource(false)} />}
        </AnimatePresence>
        <AnimatePresence>
          {showResources && resources && <ResourcesPopup resources={resources} color={cfg.color} onClose={() => setShowResources(false)} />}
        </AnimatePresence>
        <AnimatePresence>
          {selectedImage && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-6" onClick={() => setSelectedImage(null)}>
              <motion.img initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                src={selectedImage} alt="Preview" className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()} />
              <button onClick={() => setSelectedImage(null)} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white"><X className="w-5 h-5" /></button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
};

export default ProjectModal;
