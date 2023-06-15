const {FirebaseDB} = require('../config/firebase')
const { doc, getDoc } = require("firebase/firestore/lite")

const getPatientInfo = async (uid) => {

    const userRef = doc(FirebaseDB, "users", uid)

    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
        return userSnap.data()
    }

    return null

}

module.exports = {
    getPatientInfo
}