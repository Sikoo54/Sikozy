// Type declaration untuk modul Vanta Clouds.
declare module "vanta/dist/vanta.clouds.min" {
  interface VantaCloudsOptions {
    el: HTMLElement;
    THREE: unknown;
    mouseControls?: boolean;
    touchControls?: boolean;
    gyroControls?: boolean;
    minHeight?: number;
    minWidth?: number;
    skyColor?: number;
    cloudColor?: number;
    cloudShadowColor?: number;
    sunlightColor?: number;
    speed?: number;
    [key: string]: unknown;
  }
  interface VantaCloudsInstance {
    destroy: () => void;
  }
  const Clouds: (options: VantaCloudsOptions) => VantaCloudsInstance;
  export default Clouds;
}