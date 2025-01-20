import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAppNavigation } from "@/navigation/AppNavigator";
import { ArrowLeft } from "lucide-react";

const PostDetail = () => {
  const { id } = useParams();
  const navigation = useAppNavigation();

  // In a real app, you would fetch the post data using the id
  // For now, we'll just display the ID
  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={navigation.goBack}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4">Post #{id}</h1>
          <p className="text-gray-600">
            This is a placeholder for the post content. In a real application, 
            you would fetch the post data using the ID and display it here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;