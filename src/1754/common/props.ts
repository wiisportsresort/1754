export type HTMLDivProps = React.HTMLAttributes<HTMLDivElement>;
export type HTMLFormProps = React.HTMLAttributes<HTMLFormElement>;
export type HTMLButtonProps = React.HTMLAttributes<HTMLButtonElement>;

export const Alignment = {
  CENTER: 'align-center' as 'align-center',
  LEFT: 'align-left' as 'align-left',
  RIGHT: 'align-right' as 'align-right',
};

export type Alignment = typeof Alignment[keyof typeof Alignment];

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
