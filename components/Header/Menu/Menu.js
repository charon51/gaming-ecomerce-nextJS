import { Container, Menu, Grid, Icon } from "semantic-ui-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import BasicModal from "components/Modal/BasicModal";
import Auth from "components/Auth";
import useAuth from "hooks/useAuth";
import { getMeApi } from "api/user";

export default function MenuWeb() {
    const [showModal, setShowModal] = useState(false);
    const [titleModal, setTitleModal] = useState("Iniciar sesión");
    const { auth, logout } = useAuth();
    const [user, setUser] = useState(undefined);

    useEffect(() => {
        (async () => {
            const response = await getMeApi(logout);
            //console.log(response);
            setUser(response);
        })()
    }, [auth])


    const onShowModal = () => setShowModal(true);
    const onCloseModal = () => setShowModal(false);

    return (
        <div className="menu">
            <Container>
                <Grid>
                    <Grid.Column className="menu__left" width={6}>
                        <MenuPlaforms />
                    </Grid.Column>
                    <Grid.Column className="menu__right" width={10}>
                        {user !== undefined && <MenuOptions
                            onShowModal={onShowModal}
                            user={user}
                            logout={logout}
                        />}

                    </Grid.Column>
                </Grid>
            </Container>
            <BasicModal
                show={showModal}
                setShow={setShowModal}
                title={titleModal}
                size="small"
            >
                <Auth onCloseModal={onCloseModal} setTitleModal={setTitleModal} />
            </BasicModal>
        </div>
    );
}

function MenuPlaforms() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null;
    }

    return (
        <Menu>
            <Link href="/play-station" passHref>
                <Menu.Item as="a">PlayStation</Menu.Item>
            </Link>
            <Link href="/xbox" passHref>
                <Menu.Item as="a">XBox</Menu.Item>
            </Link>
            <Link href="/switch" passHref>
                <Menu.Item as="a">Switch</Menu.Item>
            </Link>
        </Menu>
    );
}

function MenuOptions(props) {
    const { onShowModal, user, logout } = props;

    return (
        <Menu>
            { user ? (
                <>
                <Link href="/orders">
                    <Menu.Item as="a">
                        <Icon name="game" />
                        Mis pedidos
                    </Menu.Item>
                </Link>
                <Link href="/wishlist">
                    <Menu.Item as="a">
                        <Icon name="heart outline" />
                        Wishlist
                    </Menu.Item>
                </Link>
                <Link href="/account">
                    <Menu.Item as="a">
                        <Icon name="user outline" />
                        {user.name} {user.lastname}
                    </Menu.Item>
                </Link>
                <Link href="/cart">
                    <Menu.Item as="a" className="m-0">
                        <Icon name="cart" />
                    </Menu.Item>
                </Link>
                <Menu.Item onClick={logout}>
                    <Icon name="power off"/>
                </Menu.Item>
                </>
            ) : (
                <Menu.Item onClick={onShowModal}>
                    <Icon name="user outline" />
                    Mi cuenta
                </Menu.Item>
            )}
        </Menu>
    );
}
