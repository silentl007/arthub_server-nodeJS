// These are the routes and how to use them to send data and what will be received

/** Routes completed so far
 * Register
 * Login - implemented
 * EditProfile - implemented
 * UploadWork - implemented
 * AddCart - implemented
 * Order Add (data to send at checkout)
 * Galleries - implemented
 * Freelancers - implemented
 * SoldWorks
 * UploadedWorks - implemented
 * Orders (get orders pending or delivered)
 * CartItems - implemented
 * CartItemRemove - implemented
 * UploadedItemRemove - implemented
 * Password Reset
 */

// POST requests
const Register = {
    // tested
    link: '/apiS/register',
    type: 'POST',
    dataToSend: {
        "name": "okpongu",
        "email": "xxx@gmail.com",
        "password": "xxx",
        "address": "Lagos",
        "location": "enter_address",
        "accountType": "Gallery",
        "number": 1234
    },
    dataToReceive: 'email to activate account'
}

const Login = {
    // tested
    link: '/apiS/login',
    type: 'POST',
    dataToSend: {
        "email": "xxx@gmail.com",
        "password": "xxx",
    },
    dataToReceive: {
        token: 'token',
        user: { data: 'user data' },
    }
}

const EditProfile = {
    // tested
    link: '/apiS/edit',
    type: 'POST',
    dataToSend: {
        "userID": "...",
        "name": "okpongu",
        "email": "xxx@gmail.com",
        "address": "Lagos",
        "location": "enter_address",
        "accountType": "Gallery",
        "number": 1234,
        "aboutme": '', // freelancer
        "avatar": '', // freelancer
    },
    dataToReceive: 'status code'
}

const UploadWork = {
    // tested
    link: '/apiS/uploadworks',
    type: 'POST',
    // data to send comes from the arthub app
    dataToSend: {
        "userID": "9fdc565f-d4d0-48d6-a579-91c1a53eec77",
        "productID": "hhsgd-jjd79-nds",
        "accountType": "Gallery",
        "email": "",
        "name": "Okpongu Tama",
        "product": "Dance of Death 2",
        "cost": 300,
        "type": "sculptor",
        "avatar": "http://testavatar.com",
        "description": "test product",
        "dimension": "10 x 49",
        "weight": 10,
        "material used": "Oil, paint",
        "images": []
    },
    dataToReceive: 'status code'
}

const AddCart = {
    // tested
    link: '/apiS/cartadd/:userID/:accountType',
    type: 'POST',
    dataToSend: {
        "productID": "hhsgd-jjd79-nds",
        "accountType": "Gallery",
        "name": "Okpongu Tama",
        "product": "Dance of Death 2",
        "cost": 300,
        "type": "sculptor",
        "avatar": "http://testavatar.com",
        "description": "test product",
        "dimension": "10 x 49",
        "weight": 10,
        "material used": "Oil, paint",
    },
    dataToReceive: 'status code'
}


const OrdersAdd = {
    // tested
    link: '/purchaseorders',
    type: 'POST',
    dataToSend : {
        "userID": "",
        "status": "Pending", // default
        "accountType": "",
        "itemnumber": Number,
        "totalcost": Number,
        "itemscost": Number,
        "purchaseditems": [],
    },
    dataToReceive : 'status code'

}

// GET requests
const Galleries = {
    // tested
    link: '/apiR/gallery',
    type: 'GET',
    dataToSend: null,
    dataToReceive: [
        {
            name: '',
            address: '',
            location: '',
            number: Number,
            works: []
        }
    ]
}

const Freelancers = {
    // tested
    link: '/apiR/freelance',
    type: 'GET',
    dataToSend: null,
    dataToReceive: [
        {
            name: '',
            address: '',
            location: '',
            aboutme: '',
            avatar: '',
            number: Number,
            works: []
        }
    ]
}

const SoldWorks = {
    // tested
    link: '/apiR/soldworks/:userID/:accountType',
    type: 'GET',
    dataToSend: {
        "userID": "",
        "accountType": ""
    },
    dataToReceive: [
        {
            "userID": "9fdc565f-d4d0-48d6-a579-91c1a53eec77",
            "productID": "hhsgd-jjd79-nds",
            "accountType": "Gallery",
            "name": "Okpongu Tama",
            "product": "Dance of Death 2",
            "cost": 300,
            "type": "sculptor",
            "avatar": "http://testavatar.com",
            "description": "test product",
            "dimension": "10 x 49",
            "weight": 10,
            "material used": "Oil, paint",
            "images": []
        }
    ]
}

const UploadedWorks = {
    // tested
    link: '/apiR/uploaded/:userID/:accountType',
    type: 'GET',
    dataToSend: {
        "userID": "",
        "accountType": ""
    },
    dataToReceive: [
        {
            "userID": "9fdc565f-d4d0-48d6-a579-91c1a53eec77",
            "productID": "hhsgd-jjd79-nds",
            "accountType": "Gallery",
            "name": "Okpongu Tama",
            "product": "Dance of Death 2",
            "cost": 300,
            "type": "sculptor",
            "avatar": "http://testavatar.com",
            "description": "test product",
            "dimension": "10 x 49",
            "weight": 10,
            "material used": "Oil, paint",
            "images": []
        }
    ]
}

const Orders = {
    // tested
    link: '/apiR/orders/:userID/:accountType', //data to send are params as userID and accountType
    type: 'GET',
    dataToSend: {
        "userID": "",
        "accountType": ""
    },
    dataToReceive: [
        {
            orderID: '',
            date: '',
            purchasedItems:
                [{
                    "userID": "9fdc565f-d4d0-48d6-a579-91c1a53eec77",
                    "productID": "hhsgd-jjd79-nds",
                    "accountType": "Gallery",
                    "name": "Okpongu Tama",
                    "product": "Dance of Death 2",
                    "cost": 300,
                    "type": "sculptor",
                    "avatar": "http://testavatar.com",
                    "description": "test product",
                    "dimension": "10 x 49",
                    "weight": 10,
                    "material used": "Oil, paint",
                    "images": []
                }]
        }
    ]
}

const CartItems = {
    // tested
    link: '/apiR/cartget/:userID/:accountType',
    type: 'GET',
    dataToSend: {
        "userID": "",
        "accountType": ""
    },
    dataToReceive: [
        {
            "userID": "9fdc565f-d4d0-48d6-a579-91c1a53eec77",
            "productID": "hhsgd-jjd79-nds",
            "accountType": "Gallery",
            "name": "Okpongu Tama",
            "product": "Dance of Death 2",
            "cost": 300,
            "type": "sculptor",
            "avatar": "http://testavatar.com",
            "description": "test product",
            "dimension": "10 x 49",
            "weight": 10,
            "materials": "Oil, paint",
            "images": []
        }
    ]
}

// DELETE
const CartItemRemove = {
    // tested
    link: '/apiD/cartremove/:userID/:productID/:accountType',
    type: 'DELETE',
    dataToSend: {
        "userID": "",
        "accountType": "",
        "productID": "",
    },
    dataToReceive: 'status code'
}

const UploadedItemRemove = {
    // tested
    link: '/apiD/uploadremove/:userID/:productID/:accountType',
    type: 'DELETE',
    dataToSend: {
        "userID": "",
        "accountType": "",
        "productID": "",
    },
    dataToReceive: 'status code'
}

// Reset Password
const Reset = {
    link: '/apiC/resetpassword',
    type: 'PUT',
    dataToSend: {
        "email": "",
        "password": "",
    },
    dataToReceive: 'status code'
}
