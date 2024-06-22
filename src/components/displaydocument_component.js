import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { GetInfo } from '../firebase/firestore';

export default function DISPLAYDOCUMENT_COMPONENT() {
  const { id } = useParams();
  const [documentData, setDocumentData] = useState(null);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const info = await GetInfo(id);

        if (info)
          setDocumentData(info);
        else
          console.error('No such document!');
      } catch (err) {
        console.error('Error fetching document: ', err);
      }
    }

    fetchInfo();
  }, [id])

  if (documentData === null) return <p>Loading...</p>

  return (
    <div>
      <h1>{documentData.name}</h1>
      <p>{documentData.imageURL && <img src={documentData.imageURL} alt='Uploaded Preview' class="img-fluid" />}</p>
      <p>Description: {documentData.description}</p>
      <p>Containment: {documentData.containment}</p>
      <Link to='/'>
        <button type='button'>Back to Front Page</button>
      </Link>
    </div>
  );
}