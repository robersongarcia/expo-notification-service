const { FirebaseDB } = require("../config/firebase")
const { getDocs, collection, query, where} = require("firebase/firestore/lite")

const getDoctorsTokens = async (medicId) => {

    //make a consult using firebase to the users collection where userType is "doctor" and medicId == medicId
    const usersRef = collection(FirebaseDB, "users")
    const q = query(usersRef, where("userType", "==", "doctor"), where("medicId", "==", medicId))
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
    getDoctorsTokens
}