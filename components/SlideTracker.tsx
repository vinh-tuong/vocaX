import { CarouselContext } from "pure-react-carousel";
import { useContext, useEffect } from "react";
import { speak } from "../utils/helpers";
import { Word } from "@/utils/types";

const SlideTracker = ({ items, currentSlide, setCurrentSlide, playSound, voice, speedRate }: { items: Word[], currentSlide: number, setCurrentSlide: (index: number) => void, playSound: boolean, voice: number, speedRate: number }) => {
  const carouselContext = useContext(CarouselContext);
  useEffect(() => {
    function onChange() {
      if (items[carouselContext.state.currentSlide] && carouselContext.state.currentSlide !== currentSlide) {
        setCurrentSlide(carouselContext.state.currentSlide);
      }

      if (!playSound || !items[carouselContext.state.currentSlide].word) {
        return;
      }

      if (carouselContext.state.isPlaying || carouselContext.state.currentSlide !== currentSlide) {
        speak({ phrase: items[carouselContext.state.currentSlide].word, rate: speedRate, voice });
      }
    }
    carouselContext.subscribe(onChange);
    return () => carouselContext.unsubscribe(onChange);
  }, [carouselContext, currentSlide, items, playSound, setCurrentSlide, speedRate, voice]);

  return (
    <>
      {carouselContext.state.totalSlides > 0 &&
        <span style={{ position: 'absolute', top: '5px', right: '5px' }}>{carouselContext.state.currentSlide + 1} / {carouselContext.state.totalSlides}</span>
      }
    </>
  )
};

export default SlideTracker;
