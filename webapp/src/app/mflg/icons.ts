declare module 'ionicons' {
    interface IconProps extends React.SVGProps<SVGSVGElement> {
      name: string;
    }
    export const IonIcon: React.FC<IconProps>;
  }
  