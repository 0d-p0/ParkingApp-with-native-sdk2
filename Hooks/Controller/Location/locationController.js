import axios from 'axios'
import { useState } from 'react'
import { address } from '../../../Router/address'
// [{"client_location_id": 1, "created_at": null, "loction": "kolkata", "updated_at": null}, {"client_location_id": 2, "created_at": null, "loction": "kalyanpur", "updated_at": null}, {"client_location_id": 3, "created_at": null, "loction": "kalyani", "updated_at": null}, {"client_location_id": 4, "created_at": null, "loction": "haldia", "updated_at": null}, {"client_location_id": 5, "created_at": null, "loction": "mecheda", "updated_at": null}, {"client_location_id": 6, "created_at": null, "loction": "howrah", "updated_at": null}, {"client_location_id": 7, "created_at": null, "loction": "hugely", "updated_at": null}]
function locationController() {
    const [locationData, setLocationData] = useState([])
    const handleGetLocation = async (loc_name) => {
        await axios.get(address.searchLocation, { keyword: loc_name }).then((response) => {
            const data = response.data.data.map((props) => {
                const { client_location_id, loction } = props
                const label = "label"
                const value = "value"
                return { [label]: loction, [value]: client_location_id }
            })
            setLocationData(data)
        }).catch(error => console.error(error))
    }

    return { handleGetLocation, locationData }
}

export default locationController
