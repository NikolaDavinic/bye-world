import {
  Avatar,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Icon,
  Stack,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { Company } from "../../../model/Company";

interface CompanyCardProps {
  company: Company;
}

const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
}: CompanyCardProps) => {
  console.log(company);
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="80"
          image={company.logoUrl}
          alt="company logo"
        />
        <CardContent>
          <Chip
            color="primary"
            label={company.avgReview}
            variant="outlined"
            icon={
              <Icon
                style={{ color: "RGB(246,190,0)" }}
                className="material-symbols-outlined"
              >
                stars
              </Icon>
            }
          />
          <Typography gutterBottom variant="h6" component="div">
            {company.name}
          </Typography>
          <Box></Box>

          <Box display="flex" justifyContent="center" gap="2rem">
            <Stack>
              <Typography>{company.reviewsCount}</Typography>
              <Typography variant="body1" color="gray">
                Reviews
              </Typography>
            </Stack>
            <Stack>
              <Typography>{company.listingsCount}</Typography>
              <Typography variant="body1" color="gray">
                Listings
              </Typography>
            </Stack>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CompanyCard;
