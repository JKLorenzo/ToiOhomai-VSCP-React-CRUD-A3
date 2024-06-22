import { db } from './fbconfig';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';

const infoCollection = collection(db, 'info');

function parseOutgoing(info) {
  const data = {};
  if ('name' in info) data.name = info.name;
  if ('description' in info) data.description = info.description;
  if ('containment' in info) data.containment = info.containment;
  if ('imageURL' in info) data.imageURL = info.imageURL;

  return data;
}

function parseIncoming(snapshot) {
  const info = {};
  if ('id' in snapshot) info.id = snapshot.id;

  const data = snapshot.data();
  if ('name' in data) info.name = data.name;
  if ('description' in data) info.description = data.description;
  if ('containment' in data) info.containment = data.containment;
  if ('imageURL' in data) info.imageURL = data.imageURL;

  return info;
}

export function AddInfo(info) {
  return addDoc(infoCollection, parseOutgoing(info));
}

export async function GetInfo(id = undefined) {
  if (id) {
    const reference = doc(infoCollection, id);
    const snapshot = await getDoc(reference);
    if (!snapshot.exists()) return null;
    return parseIncoming(snapshot)
  } else {
    const snapshot = await getDocs(infoCollection);
    return snapshot.docs.map(snap => parseIncoming(snap));
  }
}

export function UpdateInfo(id, info) {
  const reference = doc(infoCollection, id);
  return updateDoc(reference, parseOutgoing(info))
}

export function DeleteInfo(id) {
  const reference = doc(infoCollection, id)
  return deleteDoc(reference)
}