import { useState, useEffect } from 'react';
import './App.css';

const records = [
  {
    id: 1,
    ad: "Orhan",
    soyad: "Ekici",
    ePosta: "orhanekici@gmail.com",
    dogumTarihi: "1989-03-17"
  },
  {
    id: 2,
    ad: "Arda",
    soyad: "Toraman",
    ePosta: "arda@gmail.com",
    dogumTarihi: "2004-04-01"
  },
  {
    id: 3,
    ad: "Nihat",
    soyad: "Duysak",
    ePosta: "duysaknihat@gmail.com",
    dogumTarihi: "1988-02-12"
  },
];

function App() {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({ ad: '', soyad: '', ePosta: '', dogumTarihi: '' });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    setData(JSON.parse(localStorage.data));
  }, []);

  function save() {
    localStorage.data = JSON.stringify(data);
  }

  function updateRecord(record) {
    let foundRecord = data.find(x => x.id === record.id);
    Object.assign(foundRecord, record);
    setData([...data]);
    save();
  }

  function deleteRecord(id) {
    if (!confirm('Emin misiniz?')) { return; }
    const updatedData = data.filter(x => x.id !== id);
    setData(updatedData);
    localStorage.data = JSON.stringify(updatedData);
  }

  function handleNewStudentChange(e) {
    const { name, value } = e.target;
    setNewStudent({ ...newStudent, [name]: value });
  }

  function addNewStudent(e) {
    e.preventDefault();
    const newId = data.length ? Math.max(...data.map(x => x.id)) + 1 : 1;
    const updatedData = [...data, { ...newStudent, id: newId }];
    setData(updatedData);
    localStorage.data = JSON.stringify(updatedData);
    closeModal();
  }

  return (
    <div className='container'>
      <h1>Öğrenci Bilgi Sistemi <button onClick={openModal}>yeni</button></h1>
      <div className="studentTable">
        <ul className="studentTableTitles">
          <li>Ad</li>
          <li>Soyad</li>
          <li>E-Posta Adresi</li>
          <li>Doğum Tarihi</li>
          <li>#</li>
        </ul>
        {data.map(x => <StudentRow key={x.id} {...x} deleteRecord={deleteRecord} updateRecord={updateRecord} />)}
      </div>
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Yeni Öğrenci Ekle</h2>
            <form onSubmit={addNewStudent}>
              <input type="text" required name='ad' placeholder="Ad" onChange={handleNewStudentChange} />
              <input type="text" required name='soyad' placeholder="Soyad" onChange={handleNewStudentChange} />
              <input type="email" required name='ePosta' placeholder="E-Posta" onChange={handleNewStudentChange} />
              <input type="date" required name='dogumTarihi' onChange={handleNewStudentChange} />
              <button type='submit'>Ekle</button>
              <button type='button' onClick={closeModal}>Kapat</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StudentRow({ id, ad, soyad, ePosta, dogumTarihi, updateRecord, deleteRecord }) {
  const [isEditing, setEditing] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData);
    formObj.id = id;
    updateRecord(formObj);
    setEditing(false);
  }

  return (
    <form onSubmit={handleSubmit} onDoubleClick={() => setEditing(true)}>
      {isEditing ?
        <>
          <div className="studentTableCol">
            <input type="text" required name='ad' defaultValue={ad} />
          </div>
          <div className="studentTableCol">
            <input type="text" required name='soyad' defaultValue={soyad} />
          </div>
          <div className="studentTableCol">
            <input type="email" required name='ePosta' defaultValue={ePosta} />
          </div>
          <div className="studentTableCol">
            <input type="date" required name='dogumTarihi' defaultValue={dogumTarihi} />
          </div>
          <div className="studentTableCol">
            <button type='button' onClick={() => setEditing(false)}>Vazgeç</button>
            <button className='saveBtn' type='submit'>Kaydet</button>
          </div>
        </>
        :
        <>
          <div className="studentTableCol">{ad}</div>
          <div className="studentTableCol">{soyad}</div>
          <div className="studentTableCol">{ePosta}</div>
          <div className="studentTableCol">{dogumTarihi.split('-').reverse().join('.')}</div>
          <div className="studentTableCol">
            <button type='button' onClick={() => setEditing(true)}>Düzenle</button>
            <button className='delBtn' type='button' onClick={() => deleteRecord(id)}>Sil</button>
          </div>
        </>
      }
    </form>
  );
}

export default App;
