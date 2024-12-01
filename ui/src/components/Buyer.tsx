import React, { useState, useEffect } from 'react';
import QrReader from 'react-qr-scanner';

type Propss = {
    makeOffer: (giveValue: bigint, wantChoices: Record<string, bigint>) => void;
   
  };

const Buyer = ({makeOffer}:Propss) => {
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [productName, setProductName] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0); // New state for total amount

  // Recalculate total amount whenever quantity or price changes
  useEffect(() => {
    if (quantity !== null && price !== null) {
      setTotalAmount(quantity * price);
    }
  }, [quantity, price]);
    
    

  const handleScan = (data: any) => {
    if (data && data.text) {
      console.log('QR Scanner Data:', data);
      setScannedData(data.text); // Use the 'text' property for the QR content
      setIsScanning(false);

      // Parse the scanned data in the format "ProductName,Quantity,Price"
      const parsedData = data.text.split(',');

      if (parsedData.length === 3) {
        setProductName(parsedData[0]);
        setQuantity(parseInt(parsedData[1], 10));
        setPrice(parseFloat(parsedData[2]));
      }
    }
  };

  const handleError = (err: Error) => {
    console.error('QR Scanner Error:', err);
    alert('Error scanning QR code. Please try again.');
    setIsScanning(false);
  };

  const confirmTransaction = () => {
    if (!scannedData) {
      alert('No transaction data available to confirm.');
      return;
    }
    console.log('Transaction confirmed:', scannedData);
      // alert('Transaction confirmed!');
      makeOffer(BigInt(totalAmount) , { "Transction":BigInt(3) });
    setScannedData(null);
    setProductName(null);
    setQuantity(null);
    setPrice(null);
    setTotalAmount(0); // Reset total amount after confirming the transaction
  };

  return (
    <div className="flex flex-col w-full items-center justify-center min-h-3/2 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Buyer Page</h1>
        {!isScanning && !scannedData && (
          <button
            onClick={() => setIsScanning(true)}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
          >
            Scan QR Code
          </button>
        )}
        {isScanning && (
          <div className="relative">
            <QrReader
              delay={300}
              style={{ width: '100%' }}
              onError={handleError}
              onScan={handleScan}
            />
            <button
              onClick={() => setIsScanning(false)}
              className="mt-4 w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
            >
              Stop Scanning
            </button>
          </div>
        )}
        {scannedData && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Scanned Data:</h2>
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Product</th>
                  <th className="py-2 px-4 border-b text-left">Quantity</th>
                  <th className="py-2 px-4 border-b text-left">Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border-b">{productName}</td>
                  <td className="py-2 px-4 border-b">{quantity}</td>
                  <td className="py-2 px-4 border-b">{price ? `$${price.toFixed(2)}` : '-'}</td>
                </tr>
                {/* Displaying the total amount */}
                <tr>
                  <td colSpan={2} className="py-2 px-4 text-right font-semibold">Total:</td>
                  <td className="py-2 px-4 font-semibold">{`$${totalAmount.toFixed(2)}`}</td>
                </tr>
              </tbody>
            </table>
            {/* <button
              onClick={confirmTransaction}
              className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200 mt-4"
            >
              Confirm Transaction
            </button> */}
            <button
              onClick={() => setScannedData(null)}
              className="mt-2 w-full py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-200"
            >
              Scan Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Buyer;