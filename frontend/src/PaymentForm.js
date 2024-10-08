import React, { useState, useEffect } from 'react';
import './PaymentForm.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';

const PaymentForm = () => {
    const navigate = useNavigate();
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [provider, setProvider] = useState('SWIFT');
    const [recipientName, setRecipientName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [bankName, setBankName] = useState('');
    const [swiftCode, setSwiftCode] = useState('');
    const [message, setMessage] = useState(''); // State to store success/failure messages
    const [userId, setUserId] = useState(null); // State to store userId

    // Regex patterns for input whitelisting
    const nameRegex = /^[a-zA-Z\s]*$/; // Only letters and spaces
    const accountNumberRegex = /^[0-9]*$/; // Only numbers
    const swiftCodeRegex = /^[A-Z0-9]*$/; // Only uppercase letters and numbers
    const amountRegex = /^[0-9]+(\.[0-9]{1,2})?$/;
    const recipientNameRegex = /^[a-zA-Z\s]+$/;
    const bankNameRegex = /^[a-zA-Z\s]+$/;

    // Retrieve userId from local storage when the component mounts
    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId); // Set the userId from local storage
        } else {
            setMessage('No user logged in.');
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId) {
            setMessage('User is not logged in. Please log in to continue.');
            return;
        }

        const paymentData = {
            amount: parseFloat(amount), // Ensure amount is a number
            currency,
            provider,
            recipientName,
            accountNumber,
            bankName,
            swiftCode,
            userId, // Use the userId stored in state
            dateTime: new Date().toISOString(), // Automatically set date and time
            verification: 'pending', // Set verification to pending
        };

        try {
            const response = await fetch('https://localhost:3000/api/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Server response error:', errorData); // Debug server error
                throw new Error(`Network response was not ok: ${errorData.message}`);
            }

            const result = await response.json();
            console.log('Payment submitted successfully:', result); // Debug successful submission
            setMessage('Payment recorded successfully!'); // Set success message

            // Optionally reset form fields
            setAmount('');
            setRecipientName('');
            setAccountNumber('');
            setBankName('');
            setSwiftCode('');
        } catch (error) {
            console.error('Error submitting payment:', error);
            setMessage('Failed to record payment. Please try again.'); // Set failure message
        }
    };

    const isAmountValid = () => {
        const parsedAmount = parseFloat(amount);
        return !isNaN(parsedAmount) && parsedAmount > 0; // Ensure amount is positive
    };

    const handleInputChange = (setter, regex) => (e) => {
        const { value } = e.target;
        if (regex.test(value) || value === '') {
            setter(value); // Update state if value is valid
        }
    };

    return (
        <div className="PaymentForm">
            <h1>International Payment Form</h1>
            {message && <p>{message}</p>} {/* Display success/failure message */}
            <form onSubmit={handleSubmit}>
                {/* Form fields */}
                <div>
                    <label>
                        Amount:
                        <input
                            type="number"
                            value={amount}
                            onChange={handleInputChange(setAmount, amountRegex)}
                            required
                            min="0" // Ensure the amount is non-negative
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Currency:
                        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        Provider:
                        <select value={provider} onChange={(e) => setProvider(e.target.value)}>
                        <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                            <option value="AUD">AUD</option>
                            <option value="CAD">CAD</option>
                            <option value="AFN">Afghan Afghani</option>
                            <option value="ALL">Albanian Lek</option>
                            <option value="DZD">Algerian Dinar</option>
                            <option value="AOA">Angolan Kwanza</option>
                            <option value="XCD">East Caribbean Dollar</option>
                            <option value="ARS">Argentine Peso</option>
                            <option value="AMD">Armenian Dram</option>
                            <option value="AWG">Aruban Florin</option>
                            <option value="AZN">Azerbaijani Manat</option>
                            <option value="BSD">Bahamian Dollar</option>
                            <option value="BHD">Bahraini Dinar</option>
                            <option value="BDT">Bangladeshi Taka</option>
                            <option value="BBD">Barbadian Dollar</option>
                            <option value="BYN">Belarusian Ruble</option>
                            <option value="BZD">Belize Dollar</option>
                            <option value="BMD">Bermudian Dollar</option>
                            <option value="BTN">Bhutanese Ngultrum</option>
                            <option value="BOB">Bolivian Boliviano</option>
                            <option value="BAM">Bosnia-Herzegovina Convertible Mark</option>
                            <option value="BWP">Botswana Pula</option>
                            <option value="BRL">Brazilian Real</option>
                            <option value="GBP">British Pound Sterling</option>
                            <option value="BND">Brunei Dollar</option>
                            <option value="BGN">Bulgarian Lev</option>
                            <option value="MMK">Burmese Kyat</option>
                            <option value="BIF">Burundian Franc</option>
                            <option value="KHR">Cambodian Riel</option>
                            <option value="CAD">Canadian Dollar</option>
                            <option value="CVE">Cape Verdean Escudo</option>
                            <option value="KYD">Cayman Islands Dollar</option>
                            <option value="XAF">Central African CFA Franc</option>
                            <option value="XPF">CFP Franc</option>
                            <option value="CLP">Chilean Peso</option>
                            <option value="CNY">Chinese Yuan</option>
                            <option value="COP">Colombian Peso</option>
                            <option value="KMF">Comorian Franc</option>
                            <option value="CDF">Congolese Franc</option>
                            <option value="CRC">Costa Rican Colón</option>
                            <option value="HRK">Croatian Kuna</option>
                            <option value="CUP">Cuban Peso</option>
                            <option value="CZK">Czech Koruna</option>
                            <option value="DKK">Danish Krone</option>
                            <option value="DJF">Djiboutian Franc</option>
                            <option value="DOP">Dominican Peso</option>
                            <option value="EGP">Egyptian Pound</option>
                            <option value="SVC">El Salvador Colón</option>
                            <option value="ERN">Eritrean Nakfa</option>
                            <option value="ETB">Ethiopian Birr</option>
                            <option value="EUR">Euro</option>
                            <option value="FJD">Fijian Dollar</option>
                            <option value="FKP">Falkland Islands Pound</option>
                            <option value="GMD">Gambian Dalasi</option>
                            <option value="GEL">Georgian Lari</option>
                            <option value="GHS">Ghanaian Cedi</option>
                            <option value="GIP">Gibraltar Pound</option>
                            <option value="GTQ">Guatemalan Quetzal</option>
                            <option value="GNF">Guinean Franc</option>
                            <option value="GYD">Guyanese Dollar</option>
                            <option value="HKD">Hong Kong Dollar</option>
                            <option value="HUF">Hungarian Forint</option>
                            <option value="ISK">Icelandic Króna</option>
                            <option value="INR">Indian Rupee</option>
                            <option value="IDR">Indonesian Rupiah</option>
                            <option value="IRR">Iranian Rial</option>
                            <option value="IQD">Iraqi Dinar</option>
                            <option value="ILS">Israeli New Shekel</option>
                            <option value="JMD">Jamaican Dollar</option>
                            <option value="JPY">Japanese Yen</option>
                            <option value="JOD">Jordanian Dinar</option>
                            <option value="KZT">Kazakhstani Tenge</option>
                            <option value="KES">Kenyan Shilling</option>
                            <option value="KWD">Kuwaiti Dinar</option>
                            <option value="KGS">Kyrgyzstani Som</option>
                            <option value="LAK">Lao Kip</option>
                            <option value="LBP">Lebanese Pound</option>
                            <option value="LSL">Lesotho Loti</option>
                            <option value="LRD">Liberian Dollar</option>
                            <option value="LYD">Libyan Dinar</option>
                            <option value="LTL">Lithuanian Litas</option>
                            <option value="MOP">Macanese Pataca</option>
                            <option value="MKD">Macedonian Denar</option>
                            <option value="MGA">Malagasy Ariary</option>
                            <option value="MWK">Malawian Kwacha</option>
                            <option value="MYR">Malaysian Ringgit</option>
                            <option value="MVR">Maldivian Rufiyaa</option>
                            <option value="MRU">Mauritanian Ouguiya</option>
                            <option value="MUR">Mauritian Rupee</option>
                            <option value="MXN">Mexican Peso</option>
                            <option value="MDL">Moldovan Leu</option>
                            <option value="MNT">Mongolian Tögrög</option>
                            <option value="MAD">Moroccan Dirham</option>
                            <option value="MZN">Mozambican Metical</option>
                            <option value="NAD">Namibian Dollar</option>
                            <option value="NPR">Nepalese Rupee</option>
                            <option value="ANG">Netherlands Antillean Guilder</option>
                            <option value="NZD">New Zealand Dollar</option>
                            <option value="NIO">Nicaraguan Córdoba</option>
                            <option value="NGN">Nigerian Naira</option>
                            <option value="KPW">North Korean Won</option>
                            <option value="NOK">Norwegian Krone</option>
                            <option value="OMR">Omani Rial</option>
                            <option value="PKR">Pakistani Rupee</option>
                            <option value="PAB">Panamanian Balboa</option>
                            <option value="PGK">Papua New Guinean Kina</option>
                            <option value="PYG">Paraguayan Guaraní</option>
                            <option value="PEN">Peruvian Sol</option>
                            <option value="PHP">Philippine Peso</option>
                            <option value="PLN">Polish Zloty</option>
                            <option value="QAR">Qatari Rial</option>
                            <option value="RON">Romanian Leu</option>
                            <option value="RUB">Russian Ruble</option>
                            <option value="RWF">Rwandan Franc</option>
                            <option value="SHP">Saint Helena Pound</option>
                            <option value="WST">Samoan Tala</option>
                            <option value="STN">São Tomé and Príncipe Dobra</option>
                            <option value="SAR">Saudi Riyal</option>
                            <option value="RSD">Serbian Dinar</option>
                            <option value="SCR">Seychellois Rupee</option>
                            <option value="SLL">Sierra Leonean Leone</option>
                            <option value="SGD">Singapore Dollar</option>
                            <option value="SBD">Solomon Islands Dollar</option>
                            <option value="SOS">Somali Shilling</option>
                            <option value="ZAR">South African Rand</option>
                            <option value="KRW">South Korean Won</option>
                            <option value="SSP">South Sudanese Pound</option>
                            <option value="LKR">Sri Lankan Rupee</option>
                            <option value="SDG">Sudanese Pound</option>
                            <option value="SRD">Surinamese Dollar</option>
                            <option value="SZL">Swazi Lilangeni</option>
                            <option value="SEK">Swedish Krona</option>
                            <option value="CHF">Swiss Franc</option>
                            <option value="SYP">Syrian Pound</option>
                            <option value="TWD">New Taiwan Dollar</option>
                            <option value="TZS">Tanzanian Shilling</option>
                            <option value="THB">Thai Baht</option>
                            <option value="TOP">Tongan Paʻanga</option>
                            <option value="TTD">Trinidad and Tobago Dollar</option>
                            <option value="TND">Tunisian Dinar</option>
                            <option value="TRY">Turkish Lira</option>
                            <option value="TMT">Turkmenistani Manat</option>
                            <option value="UGX">Ugandan Shilling</option>
                            <option value="UAH">Ukrainian Hryvnia</option>
                            <option value="AED">United Arab Emirates Dirham</option>
                            <option value="USD">United States Dollar</option>
                            <option value="UYU">Uruguayan Peso</option>
                            <option value="UZS">Uzbekistani Som</option>
                            <option value="VUV">Vanuatu Vatu</option>
                            <option value="VEF">Venezuelan Bolívar</option>
                            <option value="VND">Vietnamese Đồng</option>
                            <option value="YER">Yemeni Rial</option>
                            <option value="ZMW">Zambian Kwacha</option>
                            <option value="ZWL">Zimbabwean Dollar</option>
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        Recipient Name:
                        <input
                            type="text"
                            value={recipientName}
                            onChange={handleInputChange(setRecipientName, recipientNameRegex)}
                            required
                        />
                    </label>
                </div>
                <div>
  <label>
    Account Number:
    <input
      type="text"
      value={accountNumber}
      onChange={handleInputChange(setAccountNumber, accountNumberRegex)}
      placeholder="Enter numbers only" // Updated placeholder text
      required
    />
  </label>
</div>

                <div>
                    <label>
                        Bank Name:
                        <input
                            type="text"
                            value={bankName}
                            onChange={handleInputChange(setBankName, bankNameRegex)}
                            required
                        />
                    </label>
                </div>
                <div>
    <label>
        SWIFT Code:
        <input
            type="text"
            value={swiftCode}
            onChange={handleInputChange(setSwiftCode, swiftCodeRegex)}
            placeholder="Capital letters and numbers only"
            required
        />
    </label>

</div>

                <button type="submit" disabled={!isAmountValid()}>
                    Submit Payment
                </button>

                <button type="button" onClick={() => navigate("/Dashboard")}>
                    Go to Dashboard
                </button>
            </form>
        </div>
    );
};

export default PaymentForm;
