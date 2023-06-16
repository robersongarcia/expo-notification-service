const {FirebaseDB} = require('../config/firebase')
const { doc, getDoc, query, where, getDocs, collection } = require("firebase/firestore/lite")

const getPatientInfo = async (uid) => {

    const userRef = doc(FirebaseDB, "users", uid)

    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
        return userSnap.data()
    }

    return null

}

const getPatientsTokens = async () => {

    const usersRef = collection(FirebaseDB, "users")
    const q = query(usersRef, where("userType", "==", "patient"))
    const usersSnap = await getDocs(q)

    if(usersSnap.empty) {
        return []
    }

    const tokens = []

    usersSnap.forEach(doc => {
        const {token} = doc.data()
        tokens.push(token)
    })

    return tokens
}


module.exports = {
    getPatientInfo,
    getPatientsTokens
}