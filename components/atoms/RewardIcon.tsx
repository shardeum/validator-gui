type RewardIconProps = {
  fillColor: string;
  className?: string;
};

export const RewardIcon = ({ fillColor, className }: RewardIconProps) => {
  return (
    <svg
      preserveAspectRatio="none"
      viewBox="0 0 10 11"
      fill={fillColor}
      className={className || "h-3 w-3"}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.75 1.24805C3.6837 1.24805 3.62011 1.27439 3.57322 1.32127C3.52634 1.36815 3.5 1.43174 3.5 1.49805C3.5 1.82957 3.6317 2.14751 3.86612 2.38193C4.10054 2.61635 4.41848 2.74805 4.75 2.74805H5.25C5.58152 2.74805 5.89946 2.61635 6.13388 2.38193C6.3683 2.14751 6.5 1.82957 6.5 1.49805C6.5 1.43174 6.47366 1.36815 6.42678 1.32127C6.37989 1.27439 6.3163 1.24805 6.25 1.24805H3.75ZM2.86612 0.614163C3.10054 0.379743 3.41848 0.248047 3.75 0.248047H6.25C6.58152 0.248047 6.89946 0.379743 7.13388 0.614163C7.3683 0.848584 7.5 1.16653 7.5 1.49805C7.5 2.09478 7.26295 2.66708 6.84099 3.08904C6.41903 3.51099 5.84674 3.74805 5.25 3.74805H4.75C4.15326 3.74805 3.58097 3.51099 3.15901 3.08904C2.73705 2.66708 2.5 2.09478 2.5 1.49805C2.5 1.16653 2.6317 0.848584 2.86612 0.614163Z"
        fill={fillColor}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 3.74805C4.07174 3.74805 3.1815 4.1168 2.52513 4.77317C1.86875 5.42955 1.5 6.31979 1.5 7.24805V7.74805C1.5 8.14587 1.65804 8.5274 1.93934 8.80871C2.22064 9.09001 2.60218 9.24805 3 9.24805H7C7.39782 9.24805 7.77936 9.09001 8.06066 8.80871C8.34196 8.5274 8.5 8.14587 8.5 7.74805V7.24805C8.5 6.31979 8.13125 5.42955 7.47487 4.77317C6.8185 4.1168 5.92826 3.74805 5 3.74805ZM1.81802 4.06607C2.66193 3.22215 3.80653 2.74805 5 2.74805C6.19347 2.74805 7.33807 3.22215 8.18198 4.06607C9.02589 4.90998 9.5 6.05457 9.5 7.24805V7.74805C9.5 8.41109 9.23661 9.04697 8.76777 9.51581C8.29893 9.98465 7.66304 10.248 7 10.248H3C2.33696 10.248 1.70107 9.98465 1.23223 9.51581C0.763392 9.04697 0.5 8.41109 0.5 7.74805V7.24805C0.5 6.05457 0.974106 4.90998 1.81802 4.06607Z"
        fill={fillColor}
      />
    </svg>
  );
};
