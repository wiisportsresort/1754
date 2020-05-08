export type HTMLDivProps = React.HTMLAttributes<HTMLDivElement>;
export type HTMLFormProps = React.HTMLAttributes<HTMLFormElement>;
export type HTMLButtonProps = React.HTMLAttributes<HTMLButtonElement>;

// export const Alignment = {
//   CENTER: 'align-center' as 'align-center',
//   LEFT: 'align-left' as 'align-left',
//   RIGHT: 'align-right' as 'align-right',
// };

// export type Alignment = typeof Alignment[keyof typeof Alignment];

export type GroupName =
  | 'britain'
  | 'france'
  | 'shawnee'
  | 'mohawk'
  | 'cherokee'
  | 'ojibwe'
  | 'miami';

export interface HexContextClickData {
  oldOwner?: GroupName;
  newOwner?: GroupName;
  hexNumber: number;
  reset?: boolean;
}

declare global {
  interface Window {
    init: () => any;
  }
  const grecaptcha: {
    readonly reset: () => void;
    readonly getResponse: (widgetId?: string) => string;
    readonly render: (
      container: string | HTMLElement | Element,
      options: {
        sitekey?: string;
        theme?: 'dark' | 'light';
        size?: 'compact' | 'normal';
        tabindex?: number;
        callback?: (token: string) => any;
        'expired-callback'?: () => any;
        'error-callback'?: () => any;
      }
    ) => void;
  };
}

export enum SemanticColors {
  france = 'france',
  britain = 'britain',
  mohawk = 'mohawk',
  cherokee = 'cherokee',
  shawnee = 'shawnee',
  miami = 'miami',
  ojibwe = 'ojibwe',
}

export enum Colors {
  blue = 'france',
  red = 'britain',
  green = 'mohawk',
  purple = 'cherokee',
  orange = 'shawnee',
  pink = 'miami',
  yellow = 'ojibwe',
}
