import { useRef, useState } from "react";
import ReactCrop, {
    Crop,
    centerCrop,
    convertToPixelCrop,
    makeAspectCrop,
} from "react-image-crop";
import setCanvasPreview from "./setCanvasPreview";
import { supabase } from '@/utils/supabase/client';


const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;

const ImageCropper = ({ closeModal, updateAvatar, uid }) => {
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const [imgFormat, setImgFormat] = useState("image/jpeg");
    const [imgSrc, setImgSrc] = useState("");
    const [crop, setCrop] = useState<Crop>({ unit: '%', x: 0, y: 0, width: 100, height: 100 });
    const [error, setError] = useState("");

    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImgFormat(file.type);
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            const imageElement = new Image();
            const imageUrl = reader.result?.toString() || "";
            imageElement.src = imageUrl;

            imageElement.addEventListener("load", (e) => {
                if (error) setError("");
                const { naturalWidth, naturalHeight } = e.currentTarget;
                if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
                    setError("Image must be at least 150 x 150 pixels.");
                    return setImgSrc("");
                }
            });
            setImgSrc(imageUrl);
        });
        reader.readAsDataURL(file);
    };

    const onImageLoad = (e) => {
        const { width, height } = e.currentTarget;
        const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

        const crop = makeAspectCrop(
            {
                unit: "%",
                width: cropWidthInPercent,
            },
            ASPECT_RATIO,
            width,
            height
        );
        const centeredCrop = centerCrop(crop, width, height);
        setCrop(centeredCrop);
    };

    const uploadAvatar = async (previewCanvasRef) => {
        previewCanvasRef.current.toBlob(async (blob) => {
            if (blob) {
                const { data: url, error } = await supabase.storage
                    .from('profile_image')
                    .upload(`${uid}.${imgFormat.split('/')[1]}`, blob, {
                        contentType: imgFormat
                    });

                if (error) {
                    console.error('Error uploading profile image:', error);
                } else {
                    const { data: { publicUrl } } = supabase.storage.from('profile_image').getPublicUrl(`${uid}.${imgFormat.split('/')[1]}`);
                    const { data, error } = await supabase
                        .from('accounts')
                        .update({profile_image: publicUrl }).eq('uid', uid);
                    updateAvatar(publicUrl);
                }
            }
        }, imgFormat);
    }

    return (
        <>
            <label className="block mb-3 w-fit">
                <span className="sr-only">Choose profile photo</span>
                <input
                    type="file"
                    accept="image/*"
                    onChange={onSelectFile}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:bg-gray-700 file:text-sky-300 hover:file:bg-gray-600"
                />
            </label>
            {error && <p className="text-red-400 text-xs">{error}</p>}
            {imgSrc && (
                <div className="flex flex-col items-center">
                    <ReactCrop
                        crop={crop}
                        onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
                        circularCrop
                        keepSelection
                        aspect={ASPECT_RATIO}
                        minWidth={MIN_DIMENSION}
                    >
                        <img
                            ref={imgRef}
                            src={imgSrc}
                            alt="Upload"
                            style={{ maxHeight: "70vh" }}
                            onLoad={onImageLoad}
                        />
                    </ReactCrop>
                    <button
                        className="text-white font-mono text-xs py-2 px-4 rounded-2xl mt-4 bg-sky-500 hover:bg-sky-600"
                        onClick={() => {
                            setCanvasPreview(
                                imgRef.current!, // HTMLImageElement
                                previewCanvasRef.current!, // HTMLCanvasElement
                                convertToPixelCrop(
                                    crop!,
                                    imgRef.current.width,
                                    imgRef.current.height
                                )
                            );
                            uploadAvatar(previewCanvasRef);
                            closeModal();
                        }}
                    >
                        Crop Image
                    </button>
                </div>
            )}
            {crop && (
                <canvas
                    ref={previewCanvasRef}
                    className="mt-4"
                    style={{
                        display: "none",
                        border: "1px solid black",
                        objectFit: "contain",
                        width: 150,
                        height: 150,
                    }}
                />
            )}
        </>
    );
};
export default ImageCropper;