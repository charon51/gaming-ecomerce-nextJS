import { Form, Button } from "semantic-ui-react"
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { updatePasswordApi } from "api/user";

export default function ChangePasswordForm(props) {

    const { user, logout, setReloadUser } = props;
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: initialValues(),
        validationSchema: Yup.object(validationSchema()),
        onSubmit: async (formData) => {
            setLoading(true);
            //console.log(formData);
            const response = await updatePasswordApi(user.id, formData.password, logout);
            if (!response || response?.statusCode === 400) {
                toast.error("Error al actualizar la contraseña");
            } else {
                logout();
            }
            setLoading(false);
        }
    })

    return (
        <div className="change-email-form">
            <h4>Cambiar tu contraseña</h4>
            <Form onSubmit={formik.handleSubmit}>
                <Form.Group widths="equal">
                    <Form.Input
                        name="password"
                        type="password"
                        placeholder="Tu nueva contraseña"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={formik.errors.password} />
                    <Form.Input
                        name="repeatPassword"
                        type="password"
                        placeholder="Confirma tu nueva contraseña"
                        value={formik.values.repeatPassword}
                        onChange={formik.handleChange}
                        error={formik.errors.repeatPassword} />
                </Form.Group>
                <Button className="submit" loading={loading}>Actualizar</Button>
            </Form>
        </div>
    )
}

function initialValues() {
    return {
        password: "",
        repeatPassword: ""
    }
}

function validationSchema() {
    return {
        password: Yup.string()
            .required(true)
            .oneOf([Yup.ref("repeatPassword")], true),
        repeatPassword: Yup.string()
            .required(true)
            .oneOf([Yup.ref("password")], true),
    }
}