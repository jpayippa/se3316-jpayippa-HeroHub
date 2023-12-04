import React, { useState } from 'react';
import { RouterProvider } from "react-router-dom";
import { router } from './router/Approuter';
import Footer from './components/footer/footer';  
import PolicyModal from './components/footer/PolicyModal';  

function App() {
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState('');

  const openPolicyModal = (policyName) => {
    setSelectedPolicy(policyName);
    setIsPolicyModalOpen(true);
  };

  const closePolicyModal = () => {
    setIsPolicyModalOpen(false);
  };

  return (
    <>
      <RouterProvider router={router} />
      <Footer onPolicyClick={openPolicyModal} />
      <PolicyModal
        isOpen={isPolicyModalOpen}
        onClose={closePolicyModal}
        policyTitle={selectedPolicy}
      />
    </>
  );
}

export default App;
