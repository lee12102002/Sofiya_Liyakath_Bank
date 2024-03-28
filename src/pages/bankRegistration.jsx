import { useState } from 'react';
import '../Styles/bankRegistration.css';

function BankRegistration() {
  const [bankName, setBankName] = useState('');
  const [domainName, setDomainName] = useState('');
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
 
  const handleAdd = async () => {
 
    let bankNameInput;
    let domainNameInput;
    let documentIdInput;
    do {
      bankNameInput = prompt('Enter bank name:');
      if (bankNameInput === null) {
        return; // Exit the function if the user canceled
      }
      if (!/^[a-zA-Z0-9]+$/.test(bankNameInput.trim())) {
        alert('Please enter a valid bank name (alphabetic characters only).');
      }
    } while (!/^[a-zA-Z0-9]+$/.test(bankNameInput.trim()));
 
  do {
    domainNameInput = prompt('Enter domain name:');
    if (domainNameInput === null) {
      return; // Exit the function if the user canceled
    }
    // Check if the input is a non-empty string
    if (domainNameInput.trim() === '') {
      alert('Please enter a valid domain name (string only).');
    }
  } while (domainNameInput.trim() === '');
 
 
  const IFSCPrefix = "IFSC"; // Define the IFSC prefix
  async function checkDocumentExists(documentId) {
  const url = `https://firestore.googleapis.com/v1/projects/common-bank-db/databases/(default)/documents/bank/${documentId}`;
   
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.fields ? true : false; // If data.fields exists, the document exists; otherwise, it doesn't
    } catch (error) {
        console.error('Error checking document existence:', error);
        return false; // Assume document doesn't exist in case of an error
    }
}
do {
    // Prompt the user for the document ID
    documentIdInput = prompt('Enter document ID (IFSC followed by 5 digits):');
   
    // Check if the document ID starts with the IFSC prefix
    if (!documentIdInput.startsWith(IFSCPrefix)) {
        alert('Document ID must start with "IFSC".');
    }
    // Check if the document ID has exactly 5 characters after the prefix
    else if (documentIdInput.length !== IFSCPrefix.length + 5) {
        alert('Document ID must have 5 digits after the prefix.');
    }
    // Check if the characters after the prefix are digits
    else if (!documentIdInput.slice(IFSCPrefix.length).match(/^\d+$/)) {
        alert('Document ID must have 5 digits after the prefix.');
    }
    else {
      const exists = await checkDocumentExists(documentIdInput);
      if (exists) {
          alert('Document ID already exists. Please enter a unique document ID.');
          continue; // Ask for input again if the ID already exists
      }
      alert('Document ID is valid.');
      break; // Break out of the loop if the document ID is valid and unique
  }
} while (!documentIdInput.startsWith(IFSCPrefix) || documentIdInput.length !== IFSCPrefix.length + 5);
 
// After the loop, the document ID is valid, proceed with adding the bank
addBankToDatabase(bankNameInput.trim(), domainNameInput.trim(), documentIdInput);
};
 
  const addBankToDatabase = (bankName, domainName, documentId) => {
    const url = documentId
      ? `https://firestore.googleapis.com/v1/projects/common-bank-db/databases/(default)/documents/bank/${documentId}`
      : 'https://firestore.googleapis.com/v1/projects/common-bank-db/databases/(default)/documents/bank/';
 
    fetch(url, {
      method: documentId ? 'PATCH' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          bank_name: { stringValue: bankName },
          domain_name: { stringValue: domainName },
        },
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to add bank to database');
      }
      console.log('Bank added successfully');
    })
    .catch(error => {
      console.error('Error adding bank to database:', error);
    });
  };
 
  const handleUpdate = async () => {
    // For simplicity, let's create a basic prompt to gather input from the user
    let documentIdInput;
    while(true) {
        documentIdInput = prompt('Enter document ID for the bank you want to update:');
        if (documentIdInput === null) return; // Exit the function if the user cancels
        const exists = await checkDocumentExists(documentIdInput);
        if (!exists) {
            alert('Document ID not found. Please enter a valid document ID.');
            continue;
        }
        break;
    }
 
    const bankNameInput = prompt('Enter updated bank name:');
    const domainNameInput = prompt('Enter updated domain name:');
 
    if (bankNameInput === null || domainNameInput === null) {
        return; // Exit the function if the user cancels
    }
 
    updateBankInDatabase(bankNameInput, domainNameInput, documentIdInput);
};
 
const updateBankInDatabase = (updatedBankName, updatedDomainName, documentId) => {
    fetch(`https://firestore.googleapis.com/v1/projects/common-bank-db/databases/(default)/documents/bank/${documentId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            fields: {
                bank_name: { stringValue: updatedBankName },
                domain_name: { stringValue: updatedDomainName },
            },
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update bank in database');
        }
        alert('Bank updated successfully');
    })
    .catch(error => {
        console.error('Error updating bank in database:', error);
    });
};
 
const checkDocumentExists = async (documentId) => {
    const url = `https://firestore.googleapis.com/v1/projects/common-bank-db/databases/(default)/documents/bank/${documentId}`;
   
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.fields ? true : false; // If data.fields exists, the document exists; otherwise, it doesn't
    } catch (error) {
        console.error('Error checking document existence:', error);
        return false; // Assume document doesn't exist in case of an error
    }
};
 
 
const handleDelete = async () => {
  let documentIdToDelete;
 
  // Prompt the user to enter the document ID until a valid one is provided
  while (true) {
      documentIdToDelete = prompt('Enter the document ID to delete:');
      if (documentIdToDelete === null) return; // Exit if the user cancels the prompt
 
      const documentExists = await checkDocumentExists(documentIdToDelete);
      if (!documentExists) {
          alert('Document ID not found. Please enter a valid document ID.');
          continue; // Ask for input again if the ID does not exist
      }
      break; // Exit the loop if a valid ID is provided
  }
 
  // Open a confirmation dialog to confirm the deletion
  setIsDeleteConfirmationOpen(true);
  confirmDelete(documentIdToDelete);
};
 
const confirmDelete = (documentId) => {
  const isConfirmed = window.confirm('Are you sure you want to delete this document?');
        if (!isConfirmed) {
            setIsDeleteConfirmationOpen(false); // Close the confirmation dialog
            return;
        }
  // Proceed with the deletion
  // You can send a request to the API endpoint to delete the bank
  // After successful deletion, you may want to perform additional actions (e.g., refresh data)
  deleteBankFromDatabase(documentId)
      .then(() => {
          // Close the confirmation dialog after successful deletion
          setIsDeleteConfirmationOpen(false);
          setSuccessMessage('Document deleted successfully.');
      })
      .catch(error => {
          console.error('Error deleting bank:', error);
          // Optionally, handle the error here (e.g., display an error message to the user)
      });
};
 
const deleteBankFromDatabase = (documentId) => {
  // Construct the URL for the delete request
  const url = `https://firestore.googleapis.com/v1/projects/common-bank-db/databases/(default)/documents/bank/${documentId}`;
 
  // Send the DELETE request to delete the bank document
  return fetch(url, {
      method: 'DELETE',
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Failed to delete bank from database');
      }
      alert('Document Id deleted successfully.');
      console.log('Bank deleted successfully');
      // Optionally, perform additional actions after successful deletion
  })
  .catch(error => {
      console.error('Error deleting bank from database:', error);
      throw error; // Propagate the error to the caller
  });
};
 
 
 
  return (
    <>
      <h1 style={{color: 'darkcyan'}}>Bank Registration</h1>
      <div>
        <button onClick={handleAdd} style={{marginBottom: '20px', backgroundColor: '#207554'}}>Add</button>
        <button onClick={handleUpdate} style={{marginBottom: '20px', backgroundColor: '#207554'}}>Update</button>
        <button onClick={handleDelete} style={{backgroundColor: '#207554'}}>Delete</button>
      </div>
      {isDeleteConfirmationOpen && (
        <div className="confirmation-modal">
          <p>Are you sure you want to delete?</p>
          <button onClick={confirmDelete}>Yes</button>
          <button onClick={cancelDelete}>No</button>
        </div>
      )}
    </>
  );
}
 
export default BankRegistration;