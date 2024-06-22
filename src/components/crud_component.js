import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AddInfo, DeleteInfo, GetInfo, UpdateInfo } from '../firebase/firestore';
import { DeleteImage, UploadImage } from '../firebase/storage';

export default function CRUD_COMPONENT() {
  const [data, setData] = useState([]);

  const [id, setId] = useState();
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const [containment, setContainment] = useState();
  const [imageURL, setImageURL] = useState();
  const [previewImage, setPreviewImage] = useState();

  const [isEditting, setEditting] = useState(false);

  // useStates for CRUD operation messages
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false)

  const createInfo = async () => {
    try {
      let imgURL = imageURL;
      if (previewImage) imgURL = await UploadImage(previewImage.name, previewImage);

      const new_info = { name, description, containment, imageURL: imgURL };
      const ref = await AddInfo(new_info);
      new_info.id = ref.id;

      setData(prev => [...prev, new_info]);
      clearFields();

      setMessage("Record succesfully created!");
      setIsError(false);
    } catch (err) {
      console.error(err);
      setMessage("Error creating record!");
      setIsError(true);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000); // reset the message after 3 second
    }
  }

  const updateInfo = async () => {
    try {
      let imgURL = imageURL;

      if (previewImage) {
        // upload image if existing
        imgURL = await UploadImage(previewImage.name, previewImage)
      }

      const new_info = { name, description, containment, imageURL: imgURL };
      await UpdateInfo(id, new_info);
      new_info.id = id;

      setData(prev_data => prev_data.map(prev_info => prev_info.id === id ? new_info : prev_info));
      clearFields();

      setMessage("Record Updated Successfully");
      setIsError(false);
    } catch (err) {
      console.error(err);
      setMessage("Error Updating Record");
      setIsError(true);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  }

  const deleteInfo = async (id) => {
    try {
      await DeleteInfo(id);
      setData(prev_data => prev_data.filter(this_info => this_info.id !== id));

      setMessage("Record successfully deleted");
      setIsError(false)
    } catch (err) {
      console.error(err);
      setMessage("Error Deleting Record!");
      setIsError(true);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  }

  const deleteImage = async () => {
    try {
      await DeleteImage(imageURL);

      const new_info = { name, description, containment, imageURL: null };
      await UpdateInfo(id, new_info);
      new_info.id = id;

      setData(prev_data => prev_data.map(prev_info => prev_info.id === id ? new_info : prev_info));
      clearFields();

      setMessage("Record successfully deleted");
      setIsError(false)
    } catch (err) {
      console.error(err);
      setLoading(false);
      setMessage("Error Deleting Image!");
      setIsError(true);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  }

  const showUpdate = (values) => {
    setId(values.id);
    setName(values.name);
    setDescription(values.description);
    setContainment(values.containment);
    setImageURL(values.imageURL);

    setEditting(true);
  };

  const clearFields = () => {
    setId('');
    setName('');
    setDescription('');
    setContainment('');
    setImageURL('');
    setPreviewImage('');

    setEditting(false);
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setPreviewImage(file ?? '')
  }

  useEffect(() => {
    const getData = async () => {
      const data = await GetInfo();
      setData(data);
    };
    getData()
  }, []);

  return (
    <>
      <h1>CRUD Functions Form</h1>
      <p className='m-4'><Link to="/">
        <button type="button" className="btn btn-secondary">Back to FrontPage</button>
      </Link>
      </p>
      <div className="form-group m-4 p-5 bg-dark rounded">
        {
          isEditting === false
            ? <h4 className='mb-4 text-white display-6'>Create new info</h4>
            : <h4 className='mb-4 text-white display-6'>Edit info: <small class="text-white">{id}</small></h4>
        }
        <input className="form-control" value={name} onChange={(name) => setName(name.target.value)} placeholder='Name' />
        <br />
        <input className="form-control" value={description} onChange={(description) => setDescription(description.target.value)} placeholder='Description' />
        <br />
        <input className="form-control" value={containment} onChange={(containment) => setContainment(containment.target.value)} placeholder='Containement' />
        <br />
        {
          previewImage
            ? <img src={URL.createObjectURL(previewImage)} class="img-fluid" alt='Preview' />
            : imageURL && <img src={imageURL} alt='Uploaded' class="img-fluid" />
        }
        <br />
        <br />
        {
          imageURL
            ? <button onClick={deleteImage}>Delete Image</button>
            : <input type='file' onChange={handleImageChange} value={previewImage ? undefined : ''} />
        }
        <br />
        <br />
        {
          isEditting === false
            ? <button className="btn btn-primary" onClick={createInfo}>Create Info</button>
            : (
              <>
                <button className="btn btn-primary" onClick={updateInfo}>Update Info</button>
                {' '}
                <button className="btn btn-dark" onClick={clearFields}>Cancel</button>
              </>
            )
        }
      </div >
      {loading && <p>Loading...</p>}
      {message && <div className={`alert ${isError ? 'alert-danger' : 'alert-success'}`} role="alert">{message}</div>}
      {
        data.map(values => (
          <div key={values.id} className="form-group m-4 p-5 bg-light bg-gradient rounded">
            <h1>{values.name}</h1>
            <p><strong>Description:</strong> {values.description}</p>
            <p><strong>Containment:</strong> {values.containment}</p>
            <p>{values.imageURL && <img src={values.imageURL} alt='Uploaded Preview' class="img-fluid" />}</p>
            <button className="btn btn-danger" onClick={() => deleteInfo(values.id)}>Delete</button>
            {' '}
            <button className="btn btn-warning" onClick={() => showUpdate(values)}>Edit</button>
          </div>
        ))
      }
    </>
  );
}