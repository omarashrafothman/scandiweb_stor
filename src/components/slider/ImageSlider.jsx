import React, { Component } from "react";

class ImageSlider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex: 0,

        };

    }


    nextSlide = () => {
        const { images } = this.props;

        this.setState((prevState) => ({
            currentIndex: (prevState.currentIndex + 1) % images.length,
        }));
    };

    prevSlide = () => {
        const { images } = this.props;
        this.setState((prevState) => ({
            currentIndex:
                (prevState.currentIndex - 1 + images.length) % images.length,
        }));
    };

    render() {
        const { images } = this.props;
        const { currentIndex } = this.state;


        return (
            <div className="slider d-flex align-items-center flex-row-reverse ">
                <div className="mx-5">
                    <button className="prev" onClick={this.prevSlide}>
                        &lt;
                    </button>
                    <div className="image-wrapper">
                        <img src={images[currentIndex].image_url} alt={`Slide ${currentIndex}`} />
                    </div>
                    <button className="next" onClick={this.nextSlide}>
                        &gt;
                    </button>
                </div>

                <div className="thumbnails d-flex flex-column">
                    {images.map((image, index) => (
                        <img
                            key={index}
                            src={image.image_url}
                            alt={`Thumbnail ${index}`}
                            className={index === currentIndex ? "active" : ""}
                            onClick={() => this.setState({ currentIndex: index })}
                        />
                    ))}
                </div>
            </div>
        );
    }
}

export default ImageSlider;
