import axios from "axios";
import { address } from "../../../Router/address";
import fixedPriceStorage from "../../Sql/FixedPriceStore/fixedPriceStorage";

const fixedPriceController = () => {

    const { storeFixedPrices,deleteAllFixedPrices } =  fixedPriceStorage()
    // GET ALL VEHICLES FIXED RATES FROM ONLINE SERVERS
    const handleGetAllFixedPrices = async (token, sub_client_id) => {

        const headersList = {
            Authorization: `Bearer ${token}`,
        };
        const response = await axios.get(`${address.fixed_rate}?sub_client_id=${sub_client_id}`, {
            headers: headersList,
        });

        if (response.status == 200) {
            await deleteAllFixedPrices()
            await handleStoreVehiclesRates(response.data.data)
        }
    }

    // STORE PRICE DATA ONE BY ONE FROM ARRAY WHICH WE GOT FROM SERVER RESPONSE
    const handleStoreVehiclesRates = async (array) => {
        array.forEach(async element => {
            await storeFixedPrices(element).then(res => {
                // console.log("vehicles Rates are successfully stored")
            }).catch(error => console.error("while storing vehicle fixed prices occur an error", error))
        });
    }

    return {handleGetAllFixedPrices}
}

export default fixedPriceController