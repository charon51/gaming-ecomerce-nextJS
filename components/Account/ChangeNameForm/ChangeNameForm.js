import { Form, Button } from "semantic-ui-react"
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { updateNameApi } from "api/user";
import { useState } from "react";

export default function ChangeNameForm(props) {
    const {user, logout, setReloadUser} = props;
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: initialValues(user.name, user.lastname),
        validationSchema: Yup.object(validationSchema()),
        onSubmit: async (FormData) => {
            setLoading(true);
            const response = await updateNameApi(user.id, FormData, logout);
            if(!response){
                toast.error("Error al actualizar el nombre y apellido");
            }else{
                setReloadUser(true);
                toast.success("Nombre y apellidos actualizado");
            }
            setLoading(false);
        }
    })

  return (
    <div className="change-name-form">
        <h4>Cambia tu nombre y apellidos</h4>
        <Form onSubmit={formik.handleSubmit}>
            <Form.Group widths="equal">
                <Form.Input name="name" placeholder="Tu nuevo nombre" value={formik.values.name} onChange={formik.handleChange} error={formik.errors.name}/>
                <Form.Input name="lastname" placeholder="Tus nuevos apellidos" value={formik.values.lastname} onChange={formik.handleChange} error={formik.errors.lastname}/>
            </Form.Group>
            <Button className="submit" loading={loading}>Actualizar</Button>
        </Form>
    </div>
  )
}

function initialValues(name, lastname){
    return {
        name: name || "",
        lastname: lastname || ""
    }
}

function validationSchema(){
    return{
        name: Yup.string().required(true),
        lastname: Yup.string().required(true)
    }
}