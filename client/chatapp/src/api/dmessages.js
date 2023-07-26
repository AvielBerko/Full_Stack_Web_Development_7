import axios from "axios";
import routes from "../env.js";

export function getMessages(options) {
    return axios
        .get(routes.getMessages(options))
        .then((res) => res.data)
        .catch((err) => {
        if(err.response.data){
            return err.response.data.error;
        }
        return err.message;
        });
    }

export function sendMessage(message) {
    return axios
        .post(routes.sendMessage, message)
        .then((res) => res.data)
        .catch((err) => {
        if(err.response.data){
            return err.response.data.error;
        }
        return err.message;
        });
    }