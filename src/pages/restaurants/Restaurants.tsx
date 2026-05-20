import {
  Breadcrumb,
  Button,
  Drawer,
  Flex,
  Form,
  Popconfirm,
  Space,
  Spin,
  Table,
  Typography,
  theme,
} from "antd";
import {
  RightOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Link, Navigate } from "react-router-dom";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createTenant,
  deleteTenant,
  getTenants,
  updateTenant,
} from "../../http/api";
import type { CreateTenantData, FieldData, Tenant } from "../../types";
import { useAuthStore } from "../../store";
import RestaurantsFilter from "./RestaurantsFilter";
import React from "react";
import RestaurantForm from "./forms/RestaurantForm";
import { PER_PAGE } from "../../constants";
import { debounce } from "lodash";

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
];

const Restaurants = () => {
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();

  const [currentEditingTenant, setCurrentEditingTenant] =
    React.useState<Tenant | null>(null);

  const queryClient = useQueryClient();
  const {
    token: { colorBgLayout },
  } = theme.useToken();

  const [queryParams, setQueryParams] = React.useState({
    perPage: PER_PAGE,
    currentPage: 1,
  });

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";

  React.useEffect(() => {
    if (currentEditingTenant) {
      setDrawerOpen(true);
      form.setFieldsValue({
        name: currentEditingTenant.name,
        address: currentEditingTenant.address,
      });
    }
  }, [currentEditingTenant, form]);

  const {
    data: tenants,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["tenants", queryParams],
    queryFn: () => {
      const filteredParams = Object.fromEntries(
        Object.entries(queryParams).filter((item) => !!item[1]),
      );

      const queryString = new URLSearchParams(
        filteredParams as unknown as Record<string, string>,
      ).toString();
      return getTenants(queryString).then((res) => res.data);
    },
    placeholderData: keepPreviousData,
    enabled: isAdmin,
  });

  const { mutate: createTenantMutation } = useMutation({
    mutationKey: ["tenant"],
    mutationFn: async (data: CreateTenantData) =>
      createTenant(data).then((res) => res.data),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
  });

  const { mutate: updateTenantMutation } = useMutation({
    mutationKey: ["update-tenant"],
    mutationFn: async (data: CreateTenantData) =>
      updateTenant(data, currentEditingTenant!.id).then((res) => res.data),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
  });

  const { mutate: deleteTenantMutation } = useMutation({
    mutationKey: ["delete-tenant"],
    mutationFn: async (id: number) => deleteTenant(id).then((res) => res.data),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
  });

  const onHandleSubmit = async () => {
    await form.validateFields();
    const isEditMode = !!currentEditingTenant;
    if (isEditMode) {
      await updateTenantMutation(form.getFieldsValue());
    } else {
      await createTenantMutation(form.getFieldsValue());
    }
    form.resetFields();
    setCurrentEditingTenant(null);
    setDrawerOpen(false);
  };

  const debouncedQUpdate = React.useMemo(() => {
    return debounce((value: string | undefined) => {
      setQueryParams((prev) => ({ ...prev, q: value, currentPage: 1 }));
    }, 500);
  }, []);

  const onFilterChange = (changedFields: FieldData[]) => {
    const changedFilterFields = changedFields
      .map((item) => ({
        [item.name[0]]: item.value,
      }))
      .reduce((acc, item) => ({ ...acc, ...item }), {});

    if ("q" in changedFilterFields) {
      debouncedQUpdate(changedFilterFields.q);
    } else {
      setQueryParams((prev) => ({
        ...prev,
        ...changedFilterFields,
        currentPage: 1,
      }));
    }
  };

  if (!isAdmin) {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Flex justify="space-between">
        <Breadcrumb
          separator={<RightOutlined />}
          items={[
            { title: <Link to="/">Dashboard</Link> },
            { title: "Restaurants" },
          ]}
        />
        {isFetching && (
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        )}
        {isError && (
          <Typography.Text type="danger">{error.message}</Typography.Text>
        )}
      </Flex>

      <Form form={filterForm} onFieldsChange={onFilterChange}>
        <RestaurantsFilter>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setDrawerOpen(true)}
          >
            Add Restaurant
          </Button>
        </RestaurantsFilter>
      </Form>

      <Table
        columns={[
          ...columns,
          {
            title: "Actions",
            key: "actions",
            render: (_: string, record: Tenant) => {
              return (
                <Space>
                  <Button
                    type="link"
                    onClick={() => {
                      setCurrentEditingTenant(record);
                    }}
                  >
                    Edit
                  </Button>
                  <Popconfirm
                    title="Delete restaurant"
                    description="Are you sure you want to delete this restaurant?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => deleteTenantMutation(Number(record.id))}
                  >
                    <Button type="link" danger>
                      Delete
                    </Button>
                  </Popconfirm>
                </Space>
              );
            },
          },
        ]}
        dataSource={tenants}
        rowKey="id"
        pagination={{
          total: tenants?.total,
          pageSize: queryParams.perPage,
          current: queryParams.currentPage,
          onChange: (page) => {
            setQueryParams((prev) => ({
              ...prev,
              currentPage: page,
            }));
          },
          showTotal: (total: number, range: number[]) =>
            `Showing ${range[0]}-${range[1]} of ${total} items`,
        }}
      />

      <Drawer
        title={currentEditingTenant ? "Edit Restaurant" : "Add Restaurant"}
        width={720}
        styles={{ body: { backgroundColor: colorBgLayout } }}
        destroyOnClose={true}
        open={drawerOpen}
        onClose={() => {
          form.resetFields();
          setCurrentEditingTenant(null);
          setDrawerOpen(false);
        }}
        extra={
          <Space>
            <Button
              onClick={() => {
                form.resetFields();
                setCurrentEditingTenant(null);
                setDrawerOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button type="primary" onClick={onHandleSubmit}>
              Submit
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" form={form}>
          <RestaurantForm />
        </Form>
      </Drawer>
    </Space>
  );
};

export default Restaurants;
