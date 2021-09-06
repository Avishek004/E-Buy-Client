import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import Laptop from '../../Images/laptop.png';

const { Meta } = Card;

const AdminProductCard = ({ product, handleRemove }) => {
    const { title, description, images, slug } = product;
    return (
        <Card
            cover={
                <img src={images && images.length ? images[0].url : Laptop} alt="" style={{ height: "150px", objectFit: "cover" }} className="p-1" />
            }
            actions={[
                <Link to={`/admin/product/${slug}`}>
                    <EditOutlined className="text-warning" />
                </Link>,
                <DeleteOutlined className="text-danger" onClick={() => handleRemove(slug)} />
            ]}
        >
            <Meta title={title} description={`${description && description.substring(0, 45)}...`} />
        </Card>
    );
};

export default AdminProductCard;