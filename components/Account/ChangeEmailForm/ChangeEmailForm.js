import { Form, Button } from "semantic-ui-react"
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { updateEmailApi } from "api/user";

export default function ChangeEmailForm(props) {

    const { user, logout, setReloadUser } = props;
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: initialValues(),
        validationSchema: Yup.object(validationSchema()),
        onSubmit: async (formData) => {
            setLoading(true);
            console.log(formData);
            const response = await updateEmailApi(user.id, formData.email, logout);
            if (!response || response?.statusCode === 400) {
                toast.error("Error al actualizar el email");
            } else {
                setReloadUser(true);
                toast.success("Email actualizado");
                formik.handleReset();
            }
            setLoading(false);
        }
    })

    return (
        <div className="change-email-form">
            <h4>Cambia tu email <span>(Tu email actual: {user.email})</span> </h4>
            <Form onSubmit={formik.handleSubmit}>
                <Form.Group widths="equal">
                    <Form.Input
                        name="email"
                        placeholder="Tu nuevo e-mail"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={formik.errors.email} />
                    <Form.Input
                        name="repeatEmail"
                        placeholder="Confirma tu nuevo e-mail"
                        value={formik.values.repeatEmail}
                        onChange={formik.handleChange}
                        error={formik.errors.repeatEmail} />
                </Form.Group>
                <Button className="submit" loading={loading}>Actualizar</Button>
            </Form>
        </div>
    )
}

function initialValues() {
    return {
        email: "",
        repeatEmail: ""
    }
}

function validationSchema() {
    return {
        email: Yup.string()
            .email(true)
            .required(true)
            .oneOf([Yup.ref("repeatEmail")], true),
        repeatEmail: Yup.string()
            .email(true)
            .required(true)
            .oneOf([Yup.ref("email")], true),
    }
}