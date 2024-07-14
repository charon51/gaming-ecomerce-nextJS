import { Button, Form } from "semantic-ui-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { loginApi, resetPasswordApi } from "api/user";
import { useState } from "react";
import useAuth from "hooks/useAuth";

export default function LoginForm(props) {
  const {showRegisterForm, onCloseModal} = props;
  const [loading, setLoading] = useState(false);
  const {auth, login} = useAuth();
  //console.log(auth);;

  const formik =useFormik({
    initialValues: initialValues(),
    validationSchema: Yup.object(validationSchema()),
    onSubmit: async (formData) => {
      //console.log(formData);
      setLoading(true);
      const response = await loginApi(formData);
      //console.log(response);
      if (response?.jwt){
        login(response.jwt);
        onCloseModal();
      }else{
        toast.error("El email o la contraseña son incorrectos");
      }
      setLoading(false);
    }
  });
  

  const resetPassword = () => {
    formik.setErrors({});
    const validateEmailSchema = Yup.string().email(true).required();

    try {
      validateEmailSchema.validateSync(formik.values.identifier);
      // Si la validación pasa, procede a resetear la contraseña
      resetPasswordApi(formik.values.identifier);
    } catch (error) {
      // Si la validación falla, establece el error en formik
      formik.setErrors({ identifier: true });
    }
  }

    return (
    <Form className="login-form" onSubmit={formik.handleSubmit}>
      <Form.Input name="identifier" type="text" placeholder="Correo electrónico" onChange={formik.handleChange} error={formik.errors.identifier}/>
      <Form.Input name="password" type="password" placeholder="Contraseña" onChange={formik.handleChange} error={formik.errors.password} />

      <div className="actions">
        <Button type="button" basic onClick={showRegisterForm}>
          Registrarse
        </Button>
        <div>
        <Button className="submit" type="submit" loading={loading}>
          Entrar
        </Button>
        <Button type="button" onClick={resetPassword}>
          ¿Has olvidado la contraseña?
        </Button>
        </div>
      </div>
    </Form>
  )
}

function initialValues(){
  return {
    identifier: "",
    password: ""
  }
}


function validationSchema(){
  return {
    identifier: Yup.string().email(true).required(true),
    password: Yup.string().required(true),
  }
}
