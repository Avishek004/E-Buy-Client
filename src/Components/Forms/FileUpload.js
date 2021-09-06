import React from 'react';
import { useSelector } from 'react-redux';
import Resizer from "react-image-file-resizer";
import axios from 'axios';
import Avatar from 'antd/lib/avatar/avatar';
import { Badge } from 'antd';

const FileUpload = ({ values, setValues, setLoading }) => {
    const { user } = useSelector((state) => ({ ...state }));

    const fileUploadAndResize = (event) => {
        // console.log(event.target.files);
        // resize
        let files = event.target.files;
        let allUploadedFiles = values.images;

        if (files) {
            setLoading(true);
            for (let i = 0; i < files.length; i++) {
                Resizer.imageFileResizer(files[i], 720, 720, "JPEG", 100, 0, (uri) => {
                    // console.log(uri);
                    axios.post(
                        `${process.env.REACT_APP_API_URL}/uploadimages`,
                        { image: uri },
                        {
                            headers: {
                                authToken: user ? user.token : "",
                            }
                        }
                    )
                        .then((res) => {
                            console.log(res);
                            setLoading(false);
                            allUploadedFiles.push(res.data);
                            setValues({ ...values, images: allUploadedFiles });
                        }).catch((err) => {
                            console.log(err);
                            setLoading(false);
                        });
                },
                    "base64",
                );
            }
        }
        // send back to server to upload to cloudinary
        // set url to images[] in the parent component state - CreateProduct
    };

    const handleImageRemove = (public_id) => {
        setLoading(true);
        console.log(public_id);
        axios.post(
            `${process.env.REACT_APP_API_URL}/removeimage`,
            { public_id },
            {
                headers: {
                    authToken: user ? user.token : "",
                }
            }
        )
            .then((res) => {
                setLoading(false);
                const { images } = values;
                let filteredImages = images.filter((item) => {
                    return item.public_id !== public_id;
                });
                setValues({ ...values, images: filteredImages });
            }).catch((err) => {
                setLoading(false);
                console.log(err);
            });
    }

    return (
        <>
            <div className="row">
                {values.images && values.images.map((image) => (
                    <Badge key={image.public_id} count="X" onClick={() => handleImageRemove(image.public_id)} style={{ cursor: 'pointer' }}>
                        <Avatar src={image.url} size={100} shape="square" className="ml-3" />
                    </Badge>
                ))}
            </div>
            <div className="row">
                <label className="btn btn-primary">
                    Choose File
                    <input type="file" multiple hidden accept="images/*" onChange={fileUploadAndResize} />
                </label>
            </div>
        </>
    );
};

export default FileUpload;