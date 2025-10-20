import React, { useState } from 'react';

const AgreementPolicy = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded((prev) => !prev);
    };

    const renderPolicyContent = () => {
        return (
            <>
                <p className="mb-2">
                    Please note that by using our website, you agree to the following terms and conditions:
                </p>
                <p className="mt-2">
                    <strong>1. Product Information:</strong> We strive to ensure that all product descriptions are accurate and updated regularly.
                </p>
                <p className="mt-2">
                    <strong>2. Returns and Refunds:</strong> Our return policy allows you to return items within 21 days of purchase. Items must be unworn, unwashed, and in original packaging.
                </p>
                <p className="mt-2">
                    <strong>3. Privacy Policy:</strong> We respect your privacy and are committed to protecting your personal information. We will not share your data with third parties without your consent.
                </p>
                <p className="mt-2">
                    <strong>4. Shipping Policy:</strong> We offer standard shipping within Pakistan at a flat rate. Delivery times may vary based on location.
                </p>
                <p className="mt-2">
                    <strong>5. Order Processing:</strong> Orders are typically processed within 1-3 business days. We will contact you to for verification.
                </p>
                <p className="mt-2">
                    <strong>6. Payment Methods:</strong> We accept various payment methods, including credit/debit cards and PayPal. All transactions are secure.
                </p>
                <p className="mt-2">
                    <strong>7. Account Security:</strong> You are responsible for maintaining the confidentiality of your account information and password.
                </p>
                <p className="mt-2">
                    <strong>8. Promotional Offers:</strong> Promotional offers and discounts are subject to change without notice and may have specific terms and conditions.
                </p>
                <p className="mt-2">
                    <strong>9. Intellectual Property:</strong> All content on our website, including images and text, is the property of [Your Boutique Name] and is protected by copyright laws.
                </p>
                <p className="mt-2">
                    <strong>10. Customer Service:</strong> For any inquiries or concerns, please contact our customer service team at [email or phone number]. We are here to assist you.
                </p>
                {/* Additional terms can be added here */}
            </>
        );
    };

    return (
        <div className="p-6 mb-8 mt-8 bg-gray-50 rounded-lg shadow-lg transition-transform transform mx-auto container duration-300">
            <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Agreement Policy</h2>
            <div className="mb-4 text-gray-700">
                <div className="transition-all duration-500">
                    {isExpanded ? renderPolicyContent() : (
                        <p className="mb-2">
                            Please Read Our Agreement Policy.
                        </p>
                    )}
                    <span
                        className="text-blue-600 cursor-pointer font-semibold hover:underline transition duration-200"
                        onClick={toggleExpand}
                        role="button"
                        aria-expanded={isExpanded}
                        aria-controls="policy-content"
                    >
                        {isExpanded ? "Show Less" : "Show More"}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AgreementPolicy;
