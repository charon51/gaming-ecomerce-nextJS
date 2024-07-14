import { Modal, Icon } from "semantic-ui-react";
import { useEffect, useState } from "react";

export default function BasicModal(props) {
    const { show, setShow, title, children, ...rest } = props;
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const onClose = () => setShow(false);

    if (!isClient) return null;

    return (
        <Modal className="basic-modal" open={show} onClose={onClose} {...rest}>
            <Modal.Header>
                <span>{title}</span><Icon name="close" onClick={onClose} />
            </Modal.Header>
            <Modal.Content>
                {children}
            </Modal.Content>
        </Modal>
    );
}
